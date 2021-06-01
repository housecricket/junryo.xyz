import Link from 'next/link';
import { parseISO, format } from 'date-fns';

export default function NewsletterLink({ slug, title, publishedAt, link }) {
  return (
    <li>
      {/* <Link href={`/newsletter/${slug}`}> */}
      <Link href={`${link}`}>

        <a>{format(parseISO(publishedAt), 'MMMM dd, yyyy')}: {title}</a>
      </Link>
    </li>
  );
}