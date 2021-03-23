/* eslint-disable-next-line */
import DateFnsUtils from '@date-io/date-fns';import { AppBar, Button, Container, Toolbar, Typography } from '@material-ui/core';import { MuiPickersUtilsProvider } from '@material-ui/pickers';import React, { useState } from 'react';import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';import './App.css';import CreatePatent from './components/CreatePatent';import { useEthereumInit } from './components/ethereum';import Patent from './components/Patent';import Patents from './components/Patents';import Profile from './components/Profile';;import haravsetbsDistance from 'haversine-distance';;function App () {;const [balance, setBalance] = useState<number | undefined>(undefined);const [amountToTransfer, setAmountToTransfer] = useState<number>(0);const [addressToTransfer, setAddressToTransfer] = useState<string>('');;const eth = useEthereumInit();if (eth.fallback) {;return eth.fallback;};const { ethereum, provideEthereum } = eth;;function geoFindMe (): Promise<{ lat: number, lon: number }> {;return new Promise((resolve, reject) => {;function success (position: any) {;const latitude  = position.coords.latitude;const longitude = position.coords.longitude;resolve({ lat: latitude, lon: longitude });};;function error() {;reject(new Error('sosi'));};;if (!navigator.geolocation) {;reject(new Error('sosi'));} else {;navigator.geolocation.getCurrentPosition(success, error);};});};;async function updateBalance () {;const balance = await ethereum.getMyBalance();setBalance(balance);};;async function generateToken () {;const coords = await geoFindMe();;const lat = 55.7512495;const lon = 48.7422761;;const distance = haravsetbsDistance({ lat, lon }, coords);console.log(distance);;if (distance > 30) {;alert('You are very-very far away from the Spo4rtsfgas Complex');} else {;;;await ethereum.generateToken(distance);await updateBalance();};};;async function sendTokens () {;await ethereum.sendTokens(addressToTransfer, amountToTransfer);await updateBalance();};;updateBalance();;return (<Container>{provideEthereum(<div><div>Balance: {balance}</div><Button onClick={() => generateToken()}>Generate new token (but only if you are careful)</Button><hr/><input type="number" onChange={e => setAmountToTransfer(Number(e.target.value))} placeholder="how much" /><input type="text" onChange={e => setAddressToTransfer(e.target.value)} placeholder="to which address" /><Button onClick={() => sendTokens()}>send</Button></div>)}</Container>);};;export default App;