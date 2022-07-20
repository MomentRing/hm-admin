import request from '@/utils/request'

/**
 *获取角色列表
 * @returns
 */
export const getRoles = () => {
  return request({
    url: 'roles'
  })
}
/**
 *添加角色
 * @param {*} param0
 * @returns
 */
export const addRoles = ({ roleName, roleDesc }) => {
  return request({
    method: 'post',
    url: 'roles',
    data: {
      roleName,
      roleDesc
    }
  })
}
/**
 * 删除角色指定权限
 * @param {角色 ID} roleId
 * @param {权限 ID} rightId
 * @returns
 */
export const delRoleRight = (roleId, rightId) => {
  return request({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
/**
 *角色授权
 * @param {角色 ID} roleId
 * @param {权限 ID 列表（字符串）} rids
 * @returns
 */
export const setRoleRight = (roleId, rids) => {
  return request({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: {
      rids
    }
  })
}
