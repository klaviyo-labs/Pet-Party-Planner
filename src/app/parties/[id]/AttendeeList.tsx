import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Party} from "@/app/api/schemas/Party";
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import {GetListMemberResponseCollectionDataInner} from "klaviyo-api/model/getListMemberResponseCollectionDataInner";

interface PetDetails {
  pet_name: string | null,
  pet_type: string | null
}

export default function AttendeeList(props: {data: Array<GetListMemberResponseCollectionDataInner>}) {

  const router  = useRouter()

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Pet Type</TableCell>
            <TableCell align="right">Pet Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => {
            const petData = row.attributes.properties as PetDetails

            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {`${row.attributes.firstName} ${row.attributes.lastName}` }
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row.attributes.email}` }
                </TableCell>
                <TableCell align="right">{petData.pet_type}</TableCell>
                <TableCell align="right">{petData.pet_name}</TableCell>
              </TableRow>
            )}
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}