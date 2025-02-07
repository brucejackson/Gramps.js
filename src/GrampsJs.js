import {LitElement, html, css} from 'lit'
import {installRouter} from 'pwa-helpers/router.js'
import {installMediaQueryWatcher} from 'pwa-helpers/media-query.js'
import '@material/mwc-drawer'
import '@material/mwc-tab'
import '@material/mwc-tab-bar'
import '@material/mwc-top-app-bar'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-icon-button'
import '@material/mwc-list'
import '@material/mwc-menu'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-linear-progress'
import '@material/mwc-circular-progress'
import '@material/mwc-snackbar'
import './components/GrampsJsListItem.js'
import {mdiFamilyTree} from '@mdi/js'
import {renderIcon} from './icons.js'
import {apiGetTokens, apiGet, getSettings, apiResetPassword} from './api.js'
import {grampsStrings, additionalStrings} from './strings.js'
import './dayjs_locales.js'

import './views/GrampsjsViewPeople.js'
import './views/GrampsjsViewFamilies.js'
import './views/GrampsjsViewPlaces.js'
import './views/GrampsjsViewEvents.js'
import './views/GrampsjsViewSources.js'
import './views/GrampsjsViewCitations.js'
import './views/GrampsjsViewRepositories.js'
import './views/GrampsjsViewNotes.js'
import './views/GrampsjsViewMediaObjects.js'
import './views/GrampsjsViewPerson.js'
import './views/GrampsjsViewFamily.js'
import './views/GrampsjsViewPlace.js'
import './views/GrampsjsViewEvent.js'
import './views/GrampsjsViewSource.js'
import './views/GrampsjsViewBlog.js'
import './views/GrampsjsViewCitation.js'
import './views/GrampsjsViewDashboard.js'
import './views/GrampsjsViewRepository.js'
import './views/GrampsjsViewNote.js'
import './views/GrampsjsViewMedia.js'
import './views/GrampsjsViewSearch.js'
import './views/GrampsjsViewSettings.js'
import './views/GrampsjsViewSettingsOnboarding.js'
import './views/GrampsjsViewRecent.js'
import './views/GrampsjsViewMap.js'
import './views/GrampsjsViewTree.js'
import {sharedStyles} from './SharedStyles.js'


const LOADING_STATE_INITIAL = 0
const LOADING_STATE_UNAUTHORIZED = 1
const LOADING_STATE_UNAUTHORIZED_NOCONNECTION = 2
const LOADING_STATE_UNAUTHORIZED_RESET_PW = 3
const LOADING_STATE_MISSING_SETTINGS = 4
const LOADING_STATE_READY = 10

const BASE_DIR = ''

export class GrampsJs extends LitElement {
  static get properties() {
    return {
      wide: {type: Boolean},
      progress: {type: Boolean},
      loadingState: {type: Number},
      settings: {type: Object},
      _lang: {type: String},
      _strings: {type: Object},
      _dbInfo: {type: Object},
      _page: {type: String},
      _pageId: {type: String}
    }
  }

  constructor() {
    super()
    this.wide = false
    this.progress = false
    this.loadingState = LOADING_STATE_INITIAL
    this.settings = getSettings()
    this._lang = ''
    this._strings = {}
    this._dbInfo = {}
    this._page = 'home'
    this._pageId = ''

    this.addEventListener('MDCTopAppBar:nav', this._toggleDrawer)
  }

  static get styles() {
    return [
      sharedStyles,
      css`
      :host {
        height: 100%;
      }

      main {
        padding: 0;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      mwc-top-app-bar {
        --mdc-typography-headline6-font-family: Roboto Slab;
        --mdc-typography-headline6-font-weight: 400;
        --mdc-typography-headline6-font-size: 19px;
      }

      mwc-drawer {
        --mdc-drawer-width: 230px;
        --mdc-typography-headline6-font-family: Roboto Slab;
        --mdc-typography-headline6-font-weight: 400;
        --mdc-typography-headline6-font-size: 19px;
      }

      mwc-drawer[open]:not([type="modal"]) {
        --mdc-top-app-bar-width: calc(100% - var(--mdc-drawer-width, 256px));
      }

      mwc-linear-progress {
        --mdc-theme-primary: #4FC3F7;
      }

      grampsjs-list-item span {
        color: #444;
      }

      #login-container {
        margin: auto;
        height: 100%;
        max-width: 20em;
      }

      #login-form {
        height: 100%;
        position: relative;
        top: 25vh;
      }

      #login-form mwc-textfield {
        width: 100%;
        margin-bottom: 0.7em;
      }

      #login-form mwc-button {
      }

      #user-menu mwc-button {
        margin: 0.5em 1em;
      }

      #person-button {
        margin-left: 60px;
        margin-top: 10px;
        background-color: #E0E0E0;
        color: #444;
        border-radius: 50%;
      }
      mwc-circular-progress {
        --mdc-theme-primary: white;
      }

      #app-title:first-letter {
        text-transform:capitalize;
      }

      p.reset-link {
        padding-top: 1em;
        font-size: 0.9em;
      }

      p.success {
        padding-top: 1em;
        color: #4CAF50;
        font-size: 1.2em;
        font-weight: 400;
        --mdc-icon-size: 1.6em;
        line-height: 1.4em;
        text-align: center;
      }

      .center-xy {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        height: 100vh;
      }

      .center-xy  div {
        display: block;
        width: 20%;
      }

      .menu-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #e0e0e0;
        background-color: white;
      }

      mwc-list {
        --mdc-list-item-graphic-margin: 20px;
        --mdc-list-side-padding: 20px;
      }

      #main-menu {
      }

      #onboarding {
        width: 100%;
        max-width: 30em;
      }

      grampsjs-view-settings-onboarding {
        width: 100%;
      }

      mwc-tab-bar {
        margin: 20px;
      }

    `
    ]
  }

  render() {
    return html`
    ${this.renderContent()}
    <mwc-snackbar id="error-snackbar" leading></mwc-snackbar>
    <mwc-snackbar id="notification-snackbar" leading></mwc-snackbar>
    `
  }

  // eslint-disable-next-line class-methods-use-this
  _renderInitial() {
    return html`<div class="center-xy">
      <div>
        <mwc-linear-progress indeterminate></mwc-linear-progress>
      </div>
    </div>
`
  }

  _renderNoConn() {
    return html`No connection`
  }

  _renderLogin() {
    return html`
    <div id="login-container">
      <form id="login-form" action="${BASE_DIR}/" @keydown="${this._handleLoginKey}">
        <mwc-textfield outlined id="username" label="Username"></mwc-textfield>
        <mwc-textfield outlined id="password" label="Password" type="password"></mwc-textfield>
        <mwc-button raised label="submit" type="submit" @click="${this._submitLogin}">
          <span slot="trailingIcon" style="display:none;">
            <mwc-circular-progress indeterminate density="-7" closed id="login-progress">
            </mwc-circular-progress>
          </span>
        </mwc-button>
        <p class="reset-link">
          <span class="link" @click="${() => {this.loadingState = LOADING_STATE_UNAUTHORIZED_RESET_PW}}"
          >Lost password?</span>
        </p>
      </form>
    </div>
    `
  }

  _renderResetPw() {
    return html`
    <div id="login-container">
      <form id="login-form" action="${BASE_DIR}/">
        <div id="inner-form">
          <mwc-textfield outlined id="username" label="Username" type="text"></mwc-textfield>
          <mwc-button raised label="reset password" type="submit" @click="${this._resetPw}">
            <span slot="trailingIcon" style="display:none;">
              <mwc-circular-progress indeterminate density="-7" closed id="login-progress">
              </mwc-circular-progress>
            </span>
          </mwc-button>
        </div>
        <p class="success" id="reset-success" style="display:none;">
          <mwc-icon>check_circle</mwc-icon><br>
          A password reset link has been sent by e-mail.
        </p>
        <p class="reset-link">
          <span class="link" @click="${() => {this.loadingState = LOADING_STATE_UNAUTHORIZED}}"
          >Back</span>
        </p>
      </form>
    </div>
    `
  }

  _renderOnboarding() {
    return html`
    <div class="center-xy" id="onboarding">
      <grampsjs-view-settings-onboarding
        @onboarding:completed="${() => {this.loadingState = LOADING_STATE_READY}}"
        class="page"
        active
        .strings="${this._strings}"
      ></grampsjs-view-settings-onboarding>
    </div>
    `
  }

  renderContent() {
    if (this.loadingState === LOADING_STATE_INITIAL) {
      return this._renderInitial()
    }
    if (this.loadingState === LOADING_STATE_UNAUTHORIZED_NOCONNECTION) {
      return this._renderNoConn()
    }
    if (this.loadingState === LOADING_STATE_UNAUTHORIZED) {
      window.history.pushState({}, '', 'login')
      return this._renderLogin()
    }
    if (this.loadingState === LOADING_STATE_UNAUTHORIZED_RESET_PW) {
      return this._renderResetPw()
    }
    if (!getSettings().lang || !getSettings().homePerson) {
      this.loadingState = LOADING_STATE_MISSING_SETTINGS
    }
    if (this.loadingState === LOADING_STATE_MISSING_SETTINGS) {
      return this._renderOnboarding()
    }
    if (this.settings.lang && Object.keys(this._strings).length === 0) {
      this._loadStrings(grampsStrings, this.settings.lang)
    }
    const tabs = {
      people: this._('People'),
      families: this._('Families'),
      events: this._('Events'),
      places: this._('Places'),
      sources: this._('Sources'),
      citations: this._('Citations'),
      repositories: this._('Repositories'),
      notes: this._('Notes'),
      medialist: this._('Media Objects')
    }
    return html`
      <mwc-drawer type="dismissible" id="app-drawer" ?open="${this.wide}">
        <div id="main-menu">
          <mwc-list>
            <grampsjs-list-item href="${BASE_DIR}/" graphic="icon">
              <span>${this._('Home Page')}</span>
              <mwc-icon slot="graphic">home</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/blog" graphic="icon">
              <span>${this._('Blog')}</span>
              <mwc-icon slot="graphic">rss_feed</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/people" graphic="icon">
              <span>${this._('Lists')}</span>
              <mwc-icon slot="graphic">list</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/map" graphic="icon">
              <span>${this._('Map')}</span>
              <mwc-icon slot="graphic">map</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/tree" graphic="icon">
              <span>${this._('Family Tree')}</span>
              <mwc-icon slot="graphic">${renderIcon(mdiFamilyTree)}</mwc-icon>
            </grampsjs-list-item>
            <li divider padded role="separator"></li>
            <grampsjs-list-item href="${BASE_DIR}/recent" graphic="icon">
              <span>${this._('History')}</span>
              <mwc-icon slot="graphic">history</mwc-icon>
            </grampsjs-list-item>
          </mwc-list>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" icon="menu" @click="${this._toggleDrawer}"></mwc-icon-button>
            <div id="app-title" slot="title">${this._dbInfo?.database?.name || 'Gramps.js'}</div>
            <mwc-icon-button icon="account_circle" slot="actionItems" @click="${() => this._handleTab('settings')}"></mwc-icon-button>
            <mwc-icon-button icon="search" slot="actionItems" @click="${() => this._handleTab('search')}"></mwc-icon-button>
          </mwc-top-app-bar>
          <mwc-linear-progress indeterminate ?closed="${!this.progress}">
          </mwc-linear-progress>

        <main>


        ${this._tabHtml(tabs)}

        <grampsjs-view-dashboard class="page" ?active=${this._page === 'home'} .strings="${this._strings}" .dbInfo="${this._dbInfo}"></grampsjs-view-dashboard>
        <grampsjs-view-blog class="page" ?active=${this._page === 'blog'} .strings="${this._strings}"></grampsjs-view-blog>

        <grampsjs-view-people class="page" ?active=${this._page === 'people'} .strings="${this._strings}"></grampsjs-view-people>
        <grampsjs-view-families class="page" ?active=${this._page === 'families'} .strings="${this._strings}"></grampsjs-view-families>
        <grampsjs-view-events class="page" ?active=${this._page === 'events'} .strings="${this._strings}"></grampsjs-view-events>
        <grampsjs-view-places class="page" ?active=${this._page === 'places'} .strings="${this._strings}"></grampsjs-view-places>
        <grampsjs-view-sources class="page" ?active=${this._page === 'sources'} .strings="${this._strings}"></grampsjs-view-sources>
        <grampsjs-view-citations class="page" ?active=${this._page === 'citations'} .strings="${this._strings}"></grampsjs-view-citations>
        <grampsjs-view-repositories class="page" ?active=${this._page === 'repositories'} .strings="${this._strings}"></grampsjs-view-repositories>
        <grampsjs-view-notes class="page" ?active=${this._page === 'notes'} .strings="${this._strings}"></grampsjs-view-notes>
        <grampsjs-view-media-objects class="page" ?active=${this._page === 'medialist'} .strings="${this._strings}"></grampsjs-view-media-objects>
        <grampsjs-view-map class="page" ?active=${this._page === 'map'} .strings="${this._strings}"></grampsjs-view-map>
        <grampsjs-view-tree class="page" ?active=${this._page === 'tree'} grampsId="${this.settings.homePerson}" .strings="${this._strings}" .settings="${this.settings}"></grampsjs-view-tree>

        <grampsjs-view-person class="page" ?active=${this._page === 'person'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-person>
        <grampsjs-view-family class="page" ?active=${this._page === 'family'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-family>
        <grampsjs-view-event class="page" ?active=${this._page === 'event'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-event>
        <grampsjs-view-place class="page" ?active=${this._page === 'place'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-place>
        <grampsjs-view-source class="page" ?active=${this._page === 'source'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-source>
        <grampsjs-view-citation class="page" ?active=${this._page === 'citation'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-citation>
        <grampsjs-view-repository class="page" ?active=${this._page === 'repository'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-repository>
        <grampsjs-view-note class="page" ?active=${this._page === 'note'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-note>
        <grampsjs-view-media class="page" ?active=${this._page === 'media'} grampsId="${this._pageId}" .strings="${this._strings}"></grampsjs-view-media>
        <grampsjs-view-search class="page" ?active=${this._page === 'search'} .strings="${this._strings}"></grampsjs-view-search>
        <grampsjs-view-recent class="page" ?active=${this._page === 'recent'} .strings="${this._strings}"></grampsjs-view-recent>

        <grampsjs-view-settings class="page" ?active=${this._page === 'settings'} .strings="${this._strings}"></grampsjs-view-settings>
        </main>

      </div>
      </mwc-drawer>

    `
  }

  _tabHtml(tabs) {
    if (!(this._page in tabs)) {
      return ''
    }
    return html`
    <mwc-tab-bar activeIndex="${Object.keys(tabs).indexOf(this._page)}">
    ${Object.keys(tabs).map(key => html`<mwc-tab isMinWidthIndicator label="${tabs[key]}" @click="${() => this._handleTab(key)}"></mwc-tab>`)}
    </mwc-tab-bar>
  `
  }

  _toggleDrawer() {
    const drawer = this.shadowRoot.getElementById('app-drawer')
    if (drawer !== null) {
      drawer.open = !drawer.open
    }
  }

  _closeDrawer() {
    const drawer = this.shadowRoot.getElementById('app-drawer')
    if (drawer !== null && drawer.open) {
      drawer.open = false
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this._loadDbInfo()
  }

  firstUpdated() {
    installRouter((location) => this._loadPage(decodeURIComponent(location.pathname)))
    installMediaQueryWatcher('(min-width: 768px)', (matches) => {this.wide = matches})
    this.addEventListener('nav', this._handleNav.bind(this))
    this.addEventListener('grampsjs:error', this._handleError.bind(this))
    this.addEventListener('grampsjs:notification', this._handleNotification.bind(this))
    this.addEventListener('progress:on', this._progressOn.bind(this))
    this.addEventListener('progress:off', this._progressOff.bind(this))
    window.addEventListener('user:loggedout', this._handleLogout.bind(this))
    window.addEventListener('settings:changed', this._handleSettings.bind(this))
  }

  _loadDbInfo() {
    apiGet('/api/metadata/')
      .then(data => {
        if ('error' in data) {
          this.loadingState = LOADING_STATE_UNAUTHORIZED
        }
        if ('data' in data) {
          this._dbInfo = data.data
          if (this.language === '' && this._dbInfo?.locale?.language !== undefined) {
            this.language = this._dbInfo.locale.language
          }
          this.loadingState = LOADING_STATE_READY
        }
      })
  }


  _loadPage(path) {
    if (path === '/' || path === `${BASE_DIR}/`) {
      this._page = 'home'
      this._pageId = ''
    } else if (BASE_DIR === '') {
      const pathId = path.slice(1)
      const page = pathId.split('/')[0]
      const pageId = pathId.split('/')[1]
      this._page = page
      this._pageId = pageId || ''
    } else if (path.split('/')[0] === BASE_DIR.split('/')[0]) {
      const pathId = path.slice(1)
      const page = pathId.split('/')[1]
      const pageId = pathId.split('/')[2]
      this._page = page
      this._pageId = pageId || ''
    }

    if (!this.wide) {
      this._closeDrawer()
    }
  }

  _progressOn() {
    this.progress = true
  }

  _progressOff() {
    this.progress = false
  }


  _handleTab(page) {
    if (page !== this._page) {
      const href = `${BASE_DIR}/${page}`
      this._loadPage(href)
      window.history.pushState({}, '', href)
    }
  }

  _handleNav(e) {
    const {path} = e.detail
    const page = path.split('/')[0]
    const pageId = path.split('/')[1]
    if (page !== this._page || pageId !== this._pageId) {
      const href = `${BASE_DIR}/${path}`
      this._loadPage(href)
      window.history.pushState({}, '', href)
    }
  }

  _handleError(e) {
    const {message} = e.detail
    this._showError(message)
  }

  _handleNotification(e) {
    const {message} = e.detail
    this._showToast(message)
  }

  _handleLoginKey(event) {
    if(event.code === 'Enter') {
      this._submitLogin()
    }
  }

  update(changed) {
    super.update(changed)
    if (changed.has('settings')) {
      if (this.settings.lang && this.settings.lang !== this._lang) {
        this._loadStrings(grampsStrings, this.settings.lang)
      }
    }
  }

  _loadStrings(strings, lang) {
    apiGet(`/api/translations/${lang}?strings=${JSON.stringify(strings)}`)
      .then(data => {
        if ('data' in data) {
          this._strings = data.data.reduce((obj, item) => Object.assign(obj, {[item.original]: item.translation}), {})
          if (lang in additionalStrings) {
            this._strings = Object.assign(additionalStrings[lang], this._strings)
          }
          this._strings.__lang__ = lang
          this._lang = lang
        }
        if ('error' in data) {
          this._showError(data.error)
        }
      })
  }

  async _submitLogin() {
    const userField = this.shadowRoot.getElementById('username')
    const pwField = this.shadowRoot.getElementById('password')
    const submitProgress = this.shadowRoot.getElementById('login-progress')
    submitProgress.parentElement.style.display = 'block'
    submitProgress.closed = false
    apiGetTokens(userField.value, pwField.value)
      .then((res) => {
        if ('error' in res) {
          submitProgress.parentElement.style.display = 'none'
          submitProgress.closed = true
          this._showError(res.error)
        } else {
          document.location.href = '/'
        }
      })
  }

  async _resetPw() {
    const userField = this.shadowRoot.getElementById('username')
    if (userField.value === '') {
      this._showError('Username must not be empty.')
      return
    }
    const res = await apiResetPassword(userField.value)
    const innerForm = this.shadowRoot.getElementById('inner-form')
    const divSuccess = this.shadowRoot.getElementById('reset-success')
    if ('error' in res) {
      this._showError(res.error)
    } else {
      divSuccess.style.display = 'block'
      innerForm.style.display = 'none'
    }
  }


  _showError(msg) {
    const snackbar = this.shadowRoot.getElementById('error-snackbar')
    snackbar.labelText = `Error: ${msg}`
    snackbar.show()
  }

  _showToast(msg) {
    const snackbar = this.shadowRoot.getElementById('notification-snackbar')
    snackbar.labelText = msg
    snackbar.show()
  }

  _openUserMenu() {
    const userMenu = this.shadowRoot.getElementById('user-menu')
    userMenu.open = true
  }

  _handleLogout() {
    this.loadingState = LOADING_STATE_UNAUTHORIZED
  }

  _handleSettings() {
    this.settings = getSettings()
  }

  _(s) {
    if (s in this._strings) {
      return this._strings[s]
    }
    return s
  }

}
