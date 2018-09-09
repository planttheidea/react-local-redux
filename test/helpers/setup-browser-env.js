// external dependencies
import Adapter from 'enzyme-adapter-react-16';
import browserEnv from 'browser-env';
import enzyme from 'enzyme';

browserEnv();

enzyme.configure({adapter: new Adapter()});
