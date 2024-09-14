export const relations = [
  'Blocked by',
  'Blocks',
  'Related to',
  'Duplicate of',
  'Duplicated by',
]

export const roles = ['Maintainer', 'Editor', 'Viewer']

export const rolesColors = {
  Owner: '#bb0f0f',
  Maintainer: '#c37f03',
  Editor: 'blue',
  Viewer: 'green',
}

export const columnTypes = ['start', 'end']

export const rolesWithOwner = ['Owner', ...roles]
