module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/birthday': { page: '/birthday' },
      '/academic-calendar': { page: '/academic-calendar' },
    }
  },
}
