import React from 'react'
import PropType from 'prop-types'

const icons = {
  bold: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
    ),
  },
  italic: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z" />
    ),
  },
  image: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
    ),
  },
  head: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
    ),
  },
  link: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
    ),
  },
  quote: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M10,7L8,11H11V17H5V11L7,7H10M18,7L16,11H19V17H13V11L15,7H18Z" />
    ),
  },
  unordered: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
    ),
  },
  ordered: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M7,13H21V11H7M7,19H21V17H7M7,7H21V5H7M2,11H3.8L2,13.1V14H5V13H3.2L5,10.9V10H2M3,8H4V4H2V5H3M2,17H4V17.5H3V18.5H4V19H2V20H5V16H2V17Z" />
    ),
  },
  code: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
    ),
  },

  codeBlock: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
    ),
  },
  embed: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M7.11,10.58a1.5,1.5,0,1,0,1.49,1.5A1.5,1.5,0,0,0,7.11,10.58Zm11.37,1.5A1.49,1.49,0,1,0,17,13.58,1.5,1.5,0,0,0,18.48,12.08Zm-6.42-1.5a1.5,1.5,0,1,0,1.49,1.5A1.5,1.5,0,0,0,12.05,10.58ZM6.6,18.47a.85.85,0,0,1-.6-.25L.35,12.58a.85.85,0,0,1,0-1.2L5.93,5.8A.85.85,0,0,1,7.13,7l-5,5,5,5a.85.85,0,0,1-.6,1.45Zm10.81,0A.85.85,0,0,1,16.8,17l5-5-5-5a.85.85,0,0,1,1.2-1.2l5.58,5.58a.85.85,0,0,1,0,1.2L18,18.22A.84.84,0,0,1,17.4,18.47Z" />
    ),
  },
  table: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
    ),
  },
  divider: {
    className: '',
    viewBox: '0 0 24 24',
    path: (
      <svg viewBox="0 0 24 24">
        <path d="M19,13H5V11H19V13Z" />
      </svg>
    ),
  },
}

const Icon = ({
  name, size, className, style, ...props
}) => {
  const chosenIcon = icons[name]

  if (!chosenIcon) {
    throw new Error(`Cannot find icon ${name}`)
  }

  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox={chosenIcon.viewBox}
      style={{ ...style, width: size, height: size }}
      className={`${className ? `${className}` : ''}Icon ${chosenIcon.className}`}
    >
      { chosenIcon.path }
    </svg>
  )
}

Icon.propTypes = {
  name: PropType.string.isRequired,
  className: PropType.string,
  size: PropType.number,
  style: PropType.object,
}

Icon.defaultProps = { size: 24 }

export default Icon
