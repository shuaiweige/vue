/* @flow */

import { toArray } from "../util/index";

export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    //! Vue.use是可以传参的： Vue.use(VueRouter,arg,...)
    //! 写插件： function install(Vue,arg1,arg2,arg3,...){}
    const args = toArray(arguments, 1); // => 祛除第一个参数（插件本身）
    args.unshift(this); // => 把vue构造函数当第一个参数（this）
    if (typeof plugin.install === "function") {
      //! 执行install方法 => 插件必须有install方法
      //! install 的this是plugin插件本身 参数args是
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
