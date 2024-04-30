import { withSSRGuest } from '@/utils/withSSRGuest';

export { default } from './Login/index.page'

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});