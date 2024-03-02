// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Type Imports
import { HelpCenterCategoriesType, HelpCenterSubcategoryArticlesType } from 'src/@fake-db/types'

// ** Demo Components Imports
import HelpCenterArticle from 'src/views/pages/help-center/article'

const HelpCenterArticlePage = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return apiData ? (
    <HelpCenterArticle
      articles={apiData.articles}
      activeArticle={apiData.activeArticle}
      activeSubcategory={apiData.activeSubcategory}
    />
  ) : null
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Commented out to disable the axios call
  // const res = await axios.get('/pages/help-center/article', {
  //   params: { category: 'getting-started' }
  // })
  // const apiData: {
  //   categories: HelpCenterCategoriesType[]
  //   articles: HelpCenterSubcategoryArticlesType[]
  //   activeArticle: HelpCenterSubcategoryArticlesType
  // } = await res.data

  // Provide default or mock paths
  const paths: { params: { id: string } }[] = [];

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // Commented out to disable the axios call
  // const res = await axios.get('/pages/help-center/article', {
  //   params: { article: params?.article, category: params?.category, subcategory: params?.subcategory }
  // })
  // const apiData = await res.data

  // Provide default or mock data
  const apiData = {
    categories: [], // Replace with mock data
    articles: [], // Replace with mock data
    activeArticle: {}, // Replace with mock data
    activeSubcategory: {} // Replace with mock data
  }

  return {
    props: {
      apiData
    }
  }
}

export default HelpCenterArticlePage
