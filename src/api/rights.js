import request from '@/utils/request'
/**
 *所有权限列表
 * @param {值 list 或 tree , list 列表显示权限, tree 树状显示权限} type
 * @returns
 */
export const getAllRights = (type) => {
  return request({
    url: `rights/${type}`
  })
}
