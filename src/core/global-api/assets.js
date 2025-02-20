/* @flow */

import { ASSET_TYPES } from "shared/constants";
import { isPlainObject, validateComponentName } from "../util/index";

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    //!注册三个方法: component/filter/directive
    //!使用： Vue.component('comp',{})
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "production" && type === "component") {
          validateComponentName(id);
        }
        if (type === "component" && isPlainObject(definition)) {
          //! name选项;
          definition.name = definition.name || id;
          //! Vue.extend({}) VueCoponent ->如何使用？
          //! 得到构造函数，将来实例化的时候new definition()-
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          definition = { bind: definition, update: definition };
        }
        //! 注册组件：opitons.components.comp = Ctor -> 返回函数
        //! 初始化的时候：选项会合并

        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
