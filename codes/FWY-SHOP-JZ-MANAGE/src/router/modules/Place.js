const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const PlaceList = () => import('@/views/place/List')
const PlaceEdit = () => import('@/views/place/Edit')

let routes = [
  {
    path: '/place/list',
    name: 'placeList',
    components: {
      default: PlaceList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '场地管理', sidebarSelected: '6-1' }
  },
  {
    path: '/place/add',
    name: 'placeAdd',
    components: {
      default: PlaceEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增场地', sidebarSelected: '6-1', pageType: 'add' }
  },
  {
    path: '/place/edit/:id',
    name: 'placeEdit',
    components: {
      default: PlaceEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改场地', sidebarSelected: '6-1' }
  },
];

export default routes;
