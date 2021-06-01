import Subscribe from '@/components/Subscribe';
import NewsletterLink from '@/components/NewsletterLink';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export default function Newsletter({ newsletters }) {
    return (
        <>
            <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
                <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
                    👀 See what's new in the world?
        </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    I send an email newsletter every Sunday with new ideas picked from 100+ sources of information all over the world from
                    the past week.
        </p>
                <Subscribe />
                <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white">Archive</h3>
                <div className="prose dark:prose-dark">
                    <ul>
                        {newsletters
                            .sort(
                                (a, b) =>
                                    Number(new Date(b.publishedAt)) -
                                    Number(new Date(a.publishedAt))
                            )
                            .map((frontMatter) => (
                                <NewsletterLink key={frontMatter.title} {...frontMatter} />
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
    const newsletters = await getAllFilesFrontMatter('newsletter');
    return { props: { newsletters } };
}