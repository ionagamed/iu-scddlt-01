import { Button, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import React, { FormEvent, useEffect, useState } from 'react'
import { Patent as PatentModel, useEthereum } from '../ethereum'

function PatentTransfer ({ patent, onTransfer }: { patent: PatentModel, onTransfer: () => void }) {
  const ethereum = useEthereum()
  const [transferTo, setTransferTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit (event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    await ethereum.transferPatent(patent.id, transferTo)
    onTransfer()
  }

  if (isLoading) {
    return <CircularProgress />
  }

  if (patent.owner.toLowerCase() === ethereum.account.toLowerCase()) {
    return (
      <form action="" onSubmit={onSubmit}>
        <TextField value={transferTo} label='Transfer To' onChange={e => setTransferTo(e.target.value)} />
        <Button variant='contained' type='submit'>Transfer</Button>
        <hr />
      </form>
    )
  }

  return <></>
}

export default function Patent ({ match }: { match: any }) {
  const id: string = match.params.id
  const ethereum = useEthereum()
  const [patent, setPatent] = useState<PatentModel | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    (async () => {
      try {
        setPatent(await ethereum.getPatent(id))
      } catch (e) {
        setError('Patent not found')
      }
    })()
  })

  if (error) {
    return <div>{error}</div>
  }

  if (!patent) {
    return <CircularProgress />
  }

  return (
    <div>
      <PatentTransfer patent={patent} onTransfer={() => setPatent(undefined)} />
      <div><strong>ID: </strong> {patent.id}</div>
      <div><strong>Owner Address: </strong> {patent.owner}</div>
      <div><strong>Inventor Name: </strong> {patent.payload.inventorName}</div>
      <div><strong>Applicant Name: </strong> {patent.payload.applicantName}</div>
      <div><strong>State: </strong> {patent.payload.state}</div>
      <div><strong>Address: </strong> {patent.payload.addr}</div>
      <div><strong>Title: </strong> {patent.payload.title}</div>
      <div><strong>Website: </strong> {patent.payload.website}</div>
      <div><strong>Country: </strong> {patent.payload.country}</div>
      <div><strong>Patent Number: </strong> {patent.payload.patentNumber}</div>
      <div><strong>Decision Number: </strong> {patent.payload.decisionNumber}</div>
      <div><strong>Decision Date (unix timestamp): </strong> {patent.payload.decisionDate}</div>
      <div><strong>Law Number: </strong> {patent.payload.lawNumber}</div>
      <div><strong>Classification Number: </strong> {patent.payload.classificationNumber}</div>
      <div><strong>Certification Authority Name: </strong> {patent.payload.certificationAuthorityName}</div>
    </div>
  )
}
