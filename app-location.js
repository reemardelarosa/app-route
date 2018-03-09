import '../polymer/polymer.js';
import '../iron-location/iron-location.js';
import '../iron-location/iron-query-params.js';
import { AppRouteConverterBehavior } from './app-route-converter-behavior.js';
import { Polymer } from '../polymer/lib/legacy/polymer-fn.js';
import { html } from '../polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <iron-query-params params-string="{{__query}}" params-object="{{queryParams}}">
    </iron-query-params>
    <iron-location path="{{__path}}" query="{{__query}}" hash="{{__hash}}" url-space-regex="{{urlSpaceRegex}}">
    </iron-location>
`,

  is: 'app-location',

  properties: {
    /**
     * A model representing the deserialized path through the route tree, as
     * well as the current queryParams.
     */
    route: {
      type: Object,
      notify: true
    },

    /**
     * In many scenarios, it is convenient to treat the `hash` as a stand-in
     * alternative to the `path`. For example, if deploying an app to a static
     * web server (e.g., Github Pages) - where one does not have control over
     * server-side routing - it is usually a better experience to use the hash
     * to represent paths through one's app.
     *
     * When this property is set to true, the `hash` will be used in place of

     * the `path` for generating a `route`.
     */
    useHashAsPath: {
      type: Boolean,
      value: false
    },

    /**
     * A regexp that defines the set of URLs that should be considered part
     * of this web app.
     *
     * Clicking on a link that matches this regex won't result in a full page
     * navigation, but will instead just update the URL state in place.
     *
     * This regexp is given everything after the origin in an absolute
     * URL. So to match just URLs that start with /search/ do:
     *     url-space-regex="^/search/"
     *
     * @type {string|RegExp}
     */
    urlSpaceRegex: {
      type: String,
      notify: true
    },

    /**
     * A set of key/value pairs that are universally accessible to branches
     * of the route tree.
     */
    __queryParams: {
      type: Object
    },

    /**
     * The pathname component of the current URL.
     */
    __path: {
      type: String
    },

    /**
     * The query string portion of the current URL.
     */
    __query: {
      type: String
    },

    /**
     * The hash portion of the current URL.
     */
    __hash: {
      type: String
    },

    /**
     * The route path, which will be either the hash or the path, depending
     * on useHashAsPath.
     */
    path: {
      type: String,
      observer: '__onPathChanged'
    },

    /**
     * Whether or not the ready function has been called.
     */
    _isReady: {
      type: Boolean
    }
  },

  behaviors: [AppRouteConverterBehavior],

  observers: [
    '__computeRoutePath(useHashAsPath, __hash, __path)'
  ],

  ready: function() {
    this._isReady = true;
  },

  __computeRoutePath: function() {
    this.path = this.useHashAsPath ? this.__hash : this.__path;
  },

  __onPathChanged: function() {
    if (!this._isReady) {
      return;
    }

    if (this.useHashAsPath) {
      this.__hash = this.path;
    } else {
      this.__path = this.path;
    }
  }
});
