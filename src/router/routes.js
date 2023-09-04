import Layout from '@/layout'

const routes = [
  {
    path: process.env.NODE_ENV === 'production' ? '/act/a20220623anniversary/' : '/',
    name: 'root',
    component: Layout,
    redirect: '',
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views'),
        meta: {
          title: '主页'
        }
      }
    ]
  }
]

export default routes
