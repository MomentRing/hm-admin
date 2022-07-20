import request from '@/utils/request'
/**
 *商品分类数据列表
 * @param {*} param0
 * @returns
 */
export const getGoodsCategories = (type, pagenum, pagesize) => {
  return request({
    url: 'categories',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}
/**
 *参数列表
 * @param {分类 ID} id
 * @param {通过 only 或 many 来获取分类静态参数还是动态参数} sel
 * @returns
 */
export const getParamsList = (id, sel) => {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    }
  })
}
/**
 * 编辑提交参数
 * @param {*} param0
 * @returns
 */
// eslint-disable-next-line camelcase
export const editSubmitParams = ({ id, attrId, attr_name, attr_sel, attr_vals }) => {
  return request({
    method: 'put',
    url: `categories/${id}/attributes/${attrId}`,
    data: {
      attr_name, attr_sel, attr_vals
    }
  })
}
/**
 * 添加动态参数或者静态属性
 * @param {*} id
 * @param {*} attr_name
 * @param {*} attr_sel
 * @param {*} attr_vals
 * @returns
 */
// eslint-disable-next-line camelcase
export const addParams = (id, attr_name, attr_sel, attr_vals) => {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data: {
      attr_name, attr_sel, attr_vals
    }
  })
}
/**
 *添加分类
 * @param {*} param0
 * @returns
 */
// eslint-disable-next-line camelcase
export const addSort = ({ cat_pid, cat_name, cat_level }) => {
  return request({
    method: 'post',
    url: 'categories',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}
