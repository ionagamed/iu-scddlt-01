import { Button, CircularProgress, TextField } from '@material-ui/core'
import React, { FormEvent, useEffect, useState } from 'react'
import { useEthereum, UserProfile } from '../ethereum'

function CurrentProfile ({ profile }: { profile: UserProfile }) {
  if (!profile.isRegistered) {
    return <>You don't currently have a profile!</>
  }

  return (
    <div>
      <div><strong>Name: </strong> {profile.name}</div>
      <div><strong>Email: </strong> {profile.email}</div>
      <div><strong>Bio: </strong> {profile.bio}</div>
    </div>
  )
}

interface ProfileFormProps {
  profile: UserProfile
  updateProfile: (x: UserProfile) => void
}

function ProfileForm ({ profile, updateProfile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [bio, setBio] = useState(profile.bio)

  function onSubmit (event: FormEvent) {
    event.preventDefault()
    updateProfile({
      name,
      email,
      bio,
      isRegistered: true
    })
  }

  return (
    <form noValidate action="" onSubmit={onSubmit}>
      <TextField label='Name' value={name} onChange={e => setName(e.target.value)} />
      <br/>
      <TextField label='E-Mail' value={email} onChange={e => setEmail(e.target.value)} />
      <br/>
      <TextField label='Bio' multiline value={bio} onChange={e => setBio(e.target.value)} />
      <br/>
      <Button variant='contained' type='submit'>Submit</Button>
    </form>
  )
}

export default function Profile () {
  const ethereum = useEthereum()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

  useEffect(() => {
    (async () => {
      setProfile(await ethereum.getMyProfile())
    })()
  }, [ethereum])

  if (!profile || isLoading) {
    return <CircularProgress/>
  }

  async function updateProfile (newProfile: UserProfile) {
    setIsLoading(true)
    console.log('updateProfile')
    await ethereum.updateMyProfile(newProfile)
    setProfile(newProfile)
    setIsLoading(false)
  }

  return (
    <div>
      <CurrentProfile profile={profile} />
      <ProfileForm profile={profile} updateProfile={updateProfile} />
    </div>
  )
}
