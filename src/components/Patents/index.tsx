import { Button } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { DataGrid, RowParams } from '@material-ui/data-grid'
import React, { useEffect, useState } from 'react'
import { MixedPatent, mixPatent, useEthereum } from '../ethereum'
import { Link, useHistory } from 'react-router-dom'

const columns = [
  { field: 'owner', headerName: 'Owner Address', width: 200 },
  { field: 'patentNumber', headerName: 'Patent number', width: 200 },
  { field: 'inventorName', headerName: 'Inventor Name', width: 200 },
  { field: 'title', headerName: 'Title', width: 500 }
]

export default function Patents () {
  const ethereum = useEthereum()
  const [patents, setPatents] = useState<MixedPatent[] | undefined>(undefined)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      setPatents((await ethereum.getAllPatents()).map(mixPatent))
    })()
  })

  if (!patents) {
    return <CircularProgress/>
  }

  return (
    <div>
      <Button component={Link} variant='contained' to='/patents/create'>Create patent</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={patents}
          columns={columns}
          onRowClick={(x: RowParams) => {
            const id = patents[x.rowIndex].id
            history.push(`/patents/${id}`)
          }}
        />
      </div>
    </div>
  )
}
