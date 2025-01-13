const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const BookCategoryList = () => import('@/views/book/category/List')
const BookTagList = () => import('@/views/book/tag/List')
const BookTagEdit = () => import('@/views/book/tag/Edit')
const BookSeriesList = () => import('@/views/book/series/List')
const BookSeriesEdit = () => import('@/views/book/series/Edit')
const BookList = () => import('@/views/book/book/List')
const BookEdit = () => import('@/views/book/book/Edit')
const BookRfid = () => import('@/views/book/book/Rfid')

let routes = [
  {
    path: '/book/category/list',
    name: 'bookCategoryList',
    components: {
      default: BookCategoryList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '绘本分类管理', sidebarSelected: '1-1' }
  },
  {
    path: '/book/tag/list',
    name: 'bookTagList',
    components: {
      default: BookTagList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '绘本标签管理', sidebarSelected: '1-2' }
  },
  {
    path: '/book/tag/add',
    name: 'bookTagAdd',
    components: {
      default: BookTagEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增标签', sidebarSelected: '1-2', pageType: 'add' }
  },
  {
    path: '/book/tag/edit/:id',
    name: 'bookTagEdit',
    components: {
      default: BookTagEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改标签', sidebarSelected: '1-2' }
  },
  {
    path: '/book/series/list',
    name: 'bookSeriesList',
    components: {
      default: BookSeriesList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '绘本系列管理', sidebarSelected: '1-4' }
  },
  {
    path: '/book/series/add',
    name: 'bookSeriesAdd',
    components: {
      default: BookSeriesEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增系列', sidebarSelected: '1-4', pageType: 'add' }
  },
  {
    path: '/book/series/edit/:id',
    name: 'bookSeriesEdit',
    components: {
      default: BookSeriesEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改系列', sidebarSelected: '1-4' }
  },
  {
    path: '/book/list',
    name: 'bookList',
    components: {
      default: BookList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '绘本管理', sidebarSelected: '1-3' }
  },
  {
    path: '/book/add',
    name: 'bookAdd',
    components: {
      default: BookEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增绘本', sidebarSelected: '1-3', pageType: 'add' }
  },
  {
    path: '/book/edit/:id',
    name: 'bookEdit',
    components: {
      default: BookEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改绘本', sidebarSelected: '1-3' }
  },
  {
    path: '/book/rfid/:id',
    name: 'bookRfid',
    components: {
      default: BookRfid,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '编码管理', sidebarSelected: '1-3' }
  },
  // {
  //   path: '/c2/edit/:id',
  //   name: 'c2Edit',
  //   components: {
  //     default: C2Edit,
  //     header: Header,
  //     sidebar: Sidebar
  //   },
  //   meta: { title: '修改C2', sidebarSelected: '4-1' }
  // },
  // {
  //   path: '/c2/add',
  //   name: 'c2Add',
  //   components: {
  //     default: C2Edit,
  //     header: Header,
  //     sidebar: Sidebar
  //   },
  //   meta: { title: '新增C2', sidebarSelected: '4-1', pageType: 'add' }
  // },
  // {
  //   path: '/c2/see/:id',
  //   name: 'c2See',
  //   components: {
  //     default: C2Edit,
  //     header: Header,
  //     sidebar: Sidebar
  //   },
  //   meta: { title: '查看C2', sidebarSelected: '4-1', pageType: 'see' }
  // }
];

export default routes;
