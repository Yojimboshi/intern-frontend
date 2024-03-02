// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import Edit from 'src/views/apps/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Commented out to disable the axios call
  // const res = await axios.get('/apps/invoice/invoices')
  // const data: InvoiceType[] = await res.data.allData

  // Provide default or mock paths
  const paths: { params: { id: string } }[] = []; // Replace with mock data if necessary

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id || 'default-id' // Provide a default or mock value if params.id is not available
    }
  }
}

export default InvoiceEdit
