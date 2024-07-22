// src\pages\apps\user\view\[tab].tsx
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log("UserView props:", { tab, invoiceData });

  return <UserViewPage tab={tab} invoiceData={invoiceData} />
}


export const getStaticPaths: GetStaticPaths = () => {
  const paths = [
    { params: { tab: 'overview' } },
    { params: { tab: 'security' } },
    { params: { tab: 'payment-setting' } },
    { params: { tab: 'notification' } },
    { params: { tab: 'connection' } }
  ];
  console.log("Generated paths:", paths);

  return {
    paths,
    fallback: false
  }
}


export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // No Axios call, just provide an empty array or any other default value for invoiceData
  const invoiceData: InvoiceType[] = []

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}



export default UserView
