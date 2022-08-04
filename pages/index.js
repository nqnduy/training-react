import MasterPageExample from 'components/website/master/MasterPageExample';
import DashkitButton from 'components/dashkit/Buttons';
import { BS } from 'components/diginext/elements/Splitters';
import { HorizontalList } from '@/components/diginext/layout/ListLayout';
import pkg from 'package.json';

export default function Home(props) {
    // const router = useRouter();
    return (
        <MasterPageExample hidePrevButton header="Diginext - Home Page">
            <h2>The ultimate framework of T.O.P Group</h2>
            <BS />
            <HorizontalList gutter={5} wrap>
                <DashkitButton href="/examples" type="success">
                    VIEW EXAMPLES
                </DashkitButton>
                <DashkitButton href="/dashkit">DASHKIT COMPONENTS</DashkitButton>
            </HorizontalList>
            <BS size={30} />
            <h3>Information</h3>
            <ul>
                <li>
                    Author:{' '}
                    <a href={`mailto:${pkg.author.email}`}>
                        <strong>{pkg.author.name}</strong> {`<${pkg.author.email}>`}
                    </a>
                </li>
                <li>Version: {pkg.version}</li>
            </ul>
        </MasterPageExample>
    );
}
