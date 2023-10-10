export const relations = [
  'Blocked by',
  'Blocks',
  'Relates to',
  'Duplicate of',
  'Duplicated by',
]

export const roles = ['Maintainer', 'Editor', 'Viewer']

export const rolesColors = {
  Owner: 'red',
  Maintainer: 'orange',
  Editor: 'blue',
  Viewer: 'green',
}

export const rolesWithOwner = ['Owner', ...roles]
