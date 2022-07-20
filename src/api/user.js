import request from '@/utils/request'

/**
 *登录
 * @param {*} param0
 * @returns
 */
export const login = ({ username, password }) => {
  return request({
    method: 'post',
    url: 'login',
    data: {
      username,
      password
    }
  })
}
/**
 *获取用户数据列表
 * @param {*} param0
 * @returns
 */
export const getUsers = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
/**
 *添加用户
 * @param {*} param0
 * @returns
 */
export const addUsers = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: 'users',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}
/**
 *修改用户状态
 * @param {用户id} uId
 * @param {用户状态} type
 * @returns
 */
export const changeUserStatus = (uId, type) => {
  return request({
    method: 'PUT',
    url: `users/${uId}/state/${type}`
  })
}
/**
 *编辑用户提交
 * @param {*} param0
 * @returns
 */
export const editorUser = ({ id, email, mobile }) => {
  return request({
    method: 'put',
    url: `users/${id}`,
    data: {
      email,
      mobile
    }
  })
}
/**
 *删除单个用户
 * @param {用户 id} id
 * @returns
 */
export const delUser = (id) => {
  return request({
    method: 'delete',
    url: `users/${id}`
  })
}
/**
 *分配用户角色
 * @param {用户 ID} id
 * @param {角色 id} rid
 * @returns
 */
export const assignUserRole = (id, rid) => {
  return request({
    method: 'put',
    url: `users/${id}/role`,
    data: {
      rid
    }
  })
}
