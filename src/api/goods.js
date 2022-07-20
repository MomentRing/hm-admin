import request from '@/utils/request'
/**
 *. 商品列表数据
 * @param {查询参数,当前页码,每页显示条数} param0
 * @returns
 */
export const getGoodsList = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'goods',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
/**
 *编辑提交商品
 * @param {*} param0
 * @returns
 */
// eslint-disable-next-line camelcase
export const editorGoods = ({ id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    method: 'put',
    url: `goods/${id}`,
    data: {
      goods_name,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}
/**
 *删除商品
 * @param {商品id} id
 * @returns
 */
export const delGoods = (id) => {
  return request({
    method: 'delete',
    url: `goods/${id}`
  })
}
/**
 * 添加商品
 * @param {*} param0
 * @returns
 */
// eslint-disable-next-line camelcase
export const addGoods = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    method: 'post',
    url: 'goods',
    data: {
      goods_name,
      goods_cat,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}
