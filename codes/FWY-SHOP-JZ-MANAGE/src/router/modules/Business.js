const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const BusinessList = () => import('@/views/business/List')
const BusinessEdit = () => import('@/views/business/Edit')

let routes = [
  {
    path: '/business/list',
    name: 'businessList',
    components: {
      default: BusinessList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '商家管理', sidebarSelected: '110-2' }
  },
  {
    path: '/business/add',
    name: 'businessAdd',
    components: {
      default: BusinessEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增商家', sidebarSelected: '110-2', pageType: 'add' }
  },
  {
    path: '/business/edit/:id',
    name: 'businessEdit',
    components: {
      default: BusinessEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改商家', sidebarSelected: '110-2' }
  },
 
];

export default routes;
