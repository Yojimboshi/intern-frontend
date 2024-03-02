// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import Preview from 'src/views/apps/invoice/preview/Preview'

const InvoicePreview = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Preview id={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Commented out to disable the axios call
  // const res = await axios.get('/apps/invoice/invoices')
  // const data: InvoiceType[] = await res.data.allData

  // Provide default or mock paths
  const paths: { params: { id: string } }[] = [];

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}

export default InvoicePreview
