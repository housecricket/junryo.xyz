// import Image from 'next/image'
import CustomLink from './Link'

const MDXComponents = {
  // Image,
  img: props => <Image width='600' height='460' {...props} />,
  a: CustomLink,
}

export default MDXComponents
