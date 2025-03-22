// ** Store Imports
import { Provider } from 'react-redux'
import { store } from 'src/store/store'
import { Toaster } from 'react-hot-toast'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import InspectElement from 'src/components/InspectElement/InspectElement'
import Routes from 'src/components/ZoneGuard/Routes'
import language from 'src/utils/language'
import { I18nextProvider } from 'react-i18next'

// CSS File Here
import '../../public/assets/css/fonts/fonts.css'
import '../../public/assets/css/vendor/animate.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-tooltip/dist/react-tooltip.css'
import '../../public/assets/css/bootstrap.min.css'
import '../../public/assets/css/style.css'

// ** Configure JSS & ClassName
const App = ({ Component, pageProps }) => {
  // console.log(getLayout)
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })

  return (
    <Provider store={store}>
        <I18nextProvider i18n={language}>
          <Toaster position='top-center' containerClassName='toast-custom' />
          <InspectElement>
            <Routes>
              <Component {...pageProps} />
            </Routes>
          </InspectElement>
        </I18nextProvider>
    </Provider>
  )
}

export default App
