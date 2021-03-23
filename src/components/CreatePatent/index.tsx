import { Button, CircularProgress, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PatentPayload, useEthereum } from '../ethereum'

export default function CreatePatent () {
  const ethereum = useEthereum()
  const [isLoading, setIsLoading] = useState(false)
  const [payload, setPayload] = useState<PatentPayload>({
    inventorName: '',
    applicantName: '',
    state: '',
    addr: '',
    title: '',
    website: '',
    country: '',
    patentNumber: '',
    decisionNumber: '',
    decisionDate: 0,
    lawNumber: '',
    classificationNumber: '',
    certificationAuthorityName: ''
  })
  const history = useHistory()

  if (isLoading) {
    return <CircularProgress />
  }

  async function onSubmit () {
    setIsLoading(true)
    await ethereum.createPatent(payload)
    history.push(`/patents`)
  }

  return (
    <form noValidate action="" onSubmit={onSubmit}>
      <TextField
        label='Inventor Name'
        value={payload.inventorName}
        onChange={e => setPayload({ ...payload, inventorName: e.target.value })}
      />
      <br/>
      <TextField
        label='Applicant name'
        value={payload.applicantName}
        onChange={e => setPayload({ ...payload, applicantName: e.target.value })}
      />
      <br/>
      <TextField
        label='State'
        value={payload.state}
        onChange={e => setPayload({ ...payload, state: e.target.value })}
      />
      <br/>
      <TextField
        label='Address'
        value={payload.addr}
        onChange={e => setPayload({ ...payload, addr: e.target.value })}
      />
      <br/>
      <TextField
        label='Title'
        value={payload.title}
        onChange={e => setPayload({ ...payload, title: e.target.value })}
      />
      <br/>
      <TextField
        label='Website'
        value={payload.website}
        onChange={e => setPayload({ ...payload, website: e.target.value })}
      />
      <br/>
      <TextField
        label='Country'
        value={payload.country}
        onChange={e => setPayload({ ...payload, country: e.target.value })}
      />
      <br/>
      <TextField
        label='Patent number'
        value={payload.patentNumber}
        onChange={e => setPayload({ ...payload, patentNumber: e.target.value })}
      />
      <br/>
      <TextField
        label='Decision number'
        value={payload.decisionNumber}
        onChange={e => setPayload({ ...payload, decisionNumber: e.target.value })}
      />
      <br/>
      <TextField
        label="Decision date (unix timestamp)"
        type="number"
        value={payload.decisionDate}
        onChange={e => setPayload({ ...payload, decisionDate: Number(e.target.value) })}
        InputLabelProps={{
          shrink: true
        }}
      />
      <br/>
      <TextField
        label='Law number'
        value={payload.lawNumber}
        onChange={e => setPayload({ ...payload, lawNumber: e.target.value })}
      />
      <br/>
      <TextField
        label='Classification number'
        value={payload.classificationNumber}
        onChange={e => setPayload({ ...payload, classificationNumber: e.target.value })}
      />
      <br/>
      <TextField
        label='Certification authority name'
        value={payload.certificationAuthorityName}
        onChange={e => setPayload({ ...payload, certificationAuthorityName: e.target.value })}
      />
      <br/>
      <Button variant='contained' type='submit'>Submit</Button>
    </form>
  )
}

