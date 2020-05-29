import Vue from 'vue'
import {
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Button,
  Row,
  Col,
  Menu,
  MenuItem,
  Input,
  Carousel,
  CarouselItem,
  Tabs,
  TabPane,
  Message,
  Pagination
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.prototype.$message = Message
