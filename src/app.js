const Root = document.getElementById('root');
const Buttons = document.getElementById('buttons');

const reloadPageWithHash = () => {
    location.replace('http://localhost:8080/#/home');
}
reloadPageWithHash();

class Router {
    constructor(routes = {}) {
        this.routes = routes;
    }
    renderComponent(tag,node,text) {
        const component = new Component(tag, node, text);
        component.render();
    }
    renderPage() {
        let locationHash = location.hash;
        let locationKey = locationHash.split('/');
        locationKey = locationKey[1];
        for (let key in this.routes) {
            if(key === locationKey){
               console.log(this.routes[key]); 
            }
        }
    }
}

class Component {
    render() {
        const component = document.createElement(this.model[0].nodeType);
        component.innerHTML = this.model[0].textNode;
        this.model[0].parentNode.appendChild(component)
        if(this.model[0].children.length){
             this.renderChild(component, this.model[0].children );
        }
        return
    }
    renderChild(parentNode, components) {
        components.forEach(element => {
            const elementNode = document.createElement(element.nodeType);
            elementNode.innerHTML = element.textNode;
            parentNode.appendChild(elementNode);
            console.log(element);
            if(element.children){
                this.renderChild(elementNode, element.children)
            }
        });
    }
}

class Home extends Component {
    model = [{
        nodeType: 'div',
        parentNode: Root,
        props: {
            class: 'home',
        },
        textNode: 'Home',
        children: [
            {
                nodeType: 'p',
                props: {
                    class: 'home__paragraph'
                },
                textNode: 'Hey, im paragraph'
            },
            {
                nodeType: 'p',
                props: {
                    class: 'home__paragraph'
                },
                textNode: 'Im paragraph too',
                children: [
                    {
                        nodeType: 'p',
                        textNode: '0'
                    },
                    {
                        nodeType: 'span',
                        textNode: '0'
                    },
                    {
                        nodeType: 'span',
                        textNode: '0'
                    },
                    {
                        nodeType: 'span',
                        textNode: '0'
                    }
                ]
            }
        ]
    }]
}


const homePage = new Home;
homePage.render(homePage.model);

const AppRouter = new Router({
    'home': 'Home',
    'about': 'About',
    'items' : 'Items',
    // 'component' : new Component('div', Root, 'hey')
})
AppRouter.renderPage();

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
         console.log(location)
         AppRouter.renderPage();
     })
     this.node.appendChild(this.link);
    }
 }


const LinkAbout = new Link('about', 'About', Buttons)
LinkAbout.createLink();

const LinkItems = new Link('items', 'Items', Buttons)
LinkItems.createLink();

const LinkHome = new Link('home', 'Home', Buttons)
LinkHome.createLink();



// AppRouter.renderComponent('div', Root, 'You are at item now');
// AppRouter.renderComponent('div', Root, 'You are at item now');





