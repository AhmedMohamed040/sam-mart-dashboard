import { fetchSingleReasons } from 'src/actions/reasons-action';

import ReasonsViewEdit from 'src/sections/reasons/reasons-add-edit';


// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Reason',
};
interface IProps{
    params: {
      reasonID: string;
    };
  };
export default async function Page({params:{reasonID}}: IProps) {
    const reason = await fetchSingleReasons({id:reasonID});
    return <ReasonsViewEdit reason={reason.data}/>;
}
