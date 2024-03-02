// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/account-settings/AccountSettings'

const AccountSettingsTab = ({ tab, apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const mockData: PricingDataType = {
    pricingPlans: [
      // Provide mock data matching the structure of PricingPlanType
    ],
    faq: [
      // Provide mock data matching the structure of PricingFaqType
    ],
    pricingTable: {
      // Provide mock data matching the structure of PricingTableType
      header: [
        { title: 'Mock Title', subtitle: 'Mock Subtitle', isPro: true },
        // ... more header items as needed
      ],
      rows: [
        // Mock data for rows, matching the structure of PricingTableRowType
      ]
    }
  }
  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData: mockData.pricingPlans
    }
  }
}

export default AccountSettingsTab
