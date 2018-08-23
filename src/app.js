const Root = document.getElementById('root');
const Buttons = document.getElementById('buttons');

const reloadPageWithHash = () => {
    location.replace('http://localhost:8080/#/menu');
}
reloadPageWithHash();



class Router {
    constructor(routes = {}) {
        this.routes = routes;
    }
    hashHistory = [];
    currentHistoryPosition = 0;
    renderComponent(tag,node,text) {
        const component = new Component(tag, node, text);
        component.render();
    }
    goBack = () => {
        let previousPosition = this.currentHistoryPosition - 2;
        if (previousPosition < 0){
            previousPosition = 0;
        } 
        const locationKey = this.hashHistory[previousPosition];
        console.log(previousPosition);
        for (let key in this.routes) {
            if(key === locationKey){
               const currentComponent = new this.routes[key]
               currentComponent.render(); 
            }
        }
        this.currentHistoryPosition = previousPosition +1;
    }

    goForward = () => {
        let nextPosition = this.currentHistoryPosition;
        if (nextPosition > this.hashHistory.length - 1){
            nextPosition = this.hashHistory.length -1;
        } 
        const locationKey = this.hashHistory[nextPosition];
        console.log(nextPosition);
        for (let key in this.routes) {
            if(key === locationKey){
               const currentComponent = new this.routes[key]
               currentComponent.render(); 
            }
        }
        this.currentHistoryPosition = nextPosition +1;
    }
    renderPage() {        
        let locationHash = location.hash;
        let locationKey = locationHash.split('/');
        locationKey = locationKey[1];
        if (this.hashHistory){
            if(this.hashHistory.length < 10) {
                this.hashHistory.push(locationKey);
                // console.log(this.hashHistory);
            } else {
                this.hashHistory.splice(0,1);
                this.hashHistory.push(locationKey);
                console.log(this.hashHistory);
            }
        }
        console.log(this.routes);
        for (let key in this.routes) {
            
            if(key === locationKey){
            //    console.log(key);
               const currentComponent = new this.routes[key]
               currentComponent.render(); 
            }
        }
        const history = this.hashHistory ? this.hashHistory.length : false;
        if (this.currentHistoryPosition === 0 || this.currentHistoryPosition ===  history ){
            // console.log(this.currentHistoryPosition);
            this.currentHistoryPosition = this.hashHistory.length;
        }
    }
}
  
class Link {
    constructor(href, text, node) {
     this.href = href;
     this.text = text;
     this.node = node;
    }
    link =  document.createElement('a');
     createLink = () => {
     this.link.setAttribute('href', 'http://localhost:8080/#/' + this.href );
     this.link.setAttribute('class', 'button' );
     this.link.innerHTML = this.text;
     this.link.addEventListener('click', () => {
         window.onhashchange = () => {
            AppRouter.renderPage();
            console.log()
         }
     })
     return this.link;
    }
 }
 
const LinkAbout = new Link('about', 'About', Root)
const LinkItems = new Link('items', 'Items', Root)
const LinkMenu = new Link('menu', 'Menu', Root)




class Component {
    render() {
        const component = document.createElement(this.model[0].nodeType);
        component.innerHTML = this.model[0].textNode;
        this.model[0].parentNode.innerHTML = '';
        this.model[0].parentNode.appendChild(component);
        if(this.model[0].children){
             this.renderChild(component, this.model[0].children );
        }
        return
    }
    renderChild(parentNode, components) {
        components.forEach(element => {
            if(element.elementHTML){
                parentNode.appendChild(element.elementHTML);
            }
            else {
                const elementNode = document.createElement(element.nodeType);
                elementNode.innerHTML = element.textNode;
                parentNode.appendChild(elementNode);
            }
            
            if(element.children){
                this.renderChild(elementNode, element.children)
            }
        });
    }
}

class BackButton {
    constructor (text, node){
        this.text = text;
        this.node = node;
    }
    button =  document.createElement('a');
    create = () => {
        this.button.setAttribute('class', 'button__nav' );
        this.button.addEventListener('click', AppRouter.goBack);
        this.button.innerHTML = this.text;
        return this.button;
    }
}
class ForwardButton {
    constructor (text, node){
        this.text = text;
        this.node = node;
    }
    button =  document.createElement('a');
    create = () => {
        this.button.setAttribute('class', 'button__nav' );
        this.button.addEventListener('click', AppRouter.goForward);
        this.button.innerHTML = this.text;
        return this.button;
    }
}
const ButtonBack = new BackButton('back', Root)
const ButtonForward = new ForwardButton('next', Root)

class Menu extends Component {
    model = [{
        nodeType: 'div',
        parentNode: Root,
        props: {
            class: 'menu',
        },
        textNode: 'Menu',
        children: [
            {   
                elementHTML: ButtonBack.create(),
            },
            {   
                elementHTML: ButtonForward.create(),
            },
            {   
                elementHTML: LinkAbout.createLink(),
            },
            {
                elementHTML: LinkItems.createLink(),
            }
        ]
    }]
}

class About extends Component {
    model = [{
        nodeType: 'div',
        parentNode: Root,
        textNode: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui fugit porro molestiae temporibus nulla unde iure commodi reprehenderit obcaecati provident mollitia autem non, quasi magni enim et deleniti, accusantium asperiores!',
        children: [
            {   
                elementHTML: ButtonBack.create(),
            },
            {   
                elementHTML: ButtonForward.create(),
            }
        ]
    }]
}

class Items extends Component {
    items = {
        "items": {
            "1": {"name":"item1","quantity":"1","price":"20"},
            "2": {"name":"item2","quantity":"5","price":"5"},
            "3": {"name":"item3","quantity":"3","price":"30"},
            "4": {"name":"item4","quantity":"4","price":"330"}
        },
        "total": 3
    }
    parseItems() {
        const items = this.items.items;
        const itemsWrapper = document.createElement('div');
         for ( let key in items){
           const itemWrapper = document.createElement('div');
          
           itemWrapper.innerHTML = ` <h3>${items[key].name}</h3> 
            <span>${items[key].quantity}</span>
            <span>${items[key].price}</span>`;
          itemsWrapper.appendChild(itemWrapper);
         }
         return itemsWrapper;
    }
    model = [{
        nodeType: 'div',
        parentNode: Root,
        props: {
            class: 'home',
        },
        textNode: 'Items',
        children: [
            {   
                elementHTML: ButtonBack.create(),
            },
            {   
                elementHTML: ButtonForward.create(),
            },
            {   
                elementHTML: this.parseItems()
            }
        ]
    }]
}



const AppRouter = new Router({
    'menu': Menu,
    'about': About,
    'items' : Items,
})
AppRouter.renderPage();



window.onhashchange = AppRouter.renderPage;