import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import BookListLayout from '@/layouts/BookListLayout'
import { PageSeo } from '@/components/SEO'


export async function getStaticProps() {
    const posts = await getAllFilesFrontMatter('book')
    console.log(posts)

    return { props: { posts } }
}

export default function Book({ posts }) {
    return (
        <>
            <PageSeo
                title={`Book - ${siteMetadata.author}`}
                description={siteMetadata.description}
                url={`${siteMetadata.siteUrl}/book`}
            />
            <BookListLayout posts={posts} title="All Books" />
        </>
    )
}