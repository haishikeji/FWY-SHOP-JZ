const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const UserList = () => import('@/views/user/List')
const UserEdit = () => import('@/views/user/Edit')

let routes = [
  {
    path: '/user/list',
    name: 'userList',
    components: {
      default: UserList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '人员管理', sidebarSelected: '130-1' }
  },
  {
    path: '/user/add',
    name: 'userAdd',
    components: {
      default: UserEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增人员', sidebarSelected: '130-1', pageType: 'add' }
  },
  {
    path: '/user/edit/:id',
    name: 'userEdit',
    components: {
      default: UserEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '编辑人员', sidebarSelected: '130-1' }
  },
];

export default routes;
