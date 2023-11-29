import React, { Suspense, useCallback, useRef } from "react"
import { createContext, useState, useContext } from "react"
import { useAccount, useBalance } from "wagmi"
import "./App.scss"
import Element from "./assets/element.png"
import Logo from "./assets/logo.png"
import { register } from "swiper/element/bundle"
import { Swiper as SwiperDefault, SwiperSlide } from "swiper/react"
import { Pagination, EffectCards } from "swiper/modules"
import html2canvas from "html2canvas"
import { TwitterShareButton, TelegramShareButton } from "react-share"
import { useToPng } from "@hugocxl/react-to-image"
import { toPng } from "html-to-image"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-cards"

register()

const StoriesLazy = React.lazy(() => import("react-insta-stories"))
const WithSeeMore = React.lazy(() =>
	import("react-insta-stories").then((module) => ({
		default: module.WithSeeMore,
	}))
)
function ConnectButton() {
	return <w3m-button />
}

const DataContext = createContext(null)

function ConnectedBlock({ stories, className }) {
	const [isShown, setIsShown] = useState(null)

	const onClose = () => setIsShown(null)
	return (
		<>
			<div className={`connectedBlock ${className ? className : ""}`}>
				<button onClick={() => setIsShown("stories")} type="button">
					Show Stories
				</button>
				<button onClick={() => setIsShown("swiper")} type="button">
					Show Swiper
				</button>
				<button onClick={() => setIsShown("cards")} type="button">
					Show Swiper Cards
				</button>
			</div>
			{isShown === "stories" && <Stories onClose={onClose} stories={stories} />}
			{isShown === "swiper" && <Swiper onClose={onClose} />}
			{isShown === "cards" && <SwiperCards onClose={onClose} />}
		</>
	)
}
function SwiperCards({ onClose }) {
	return (
		<div className="swiperWrapper">
			<button onClick={onClose} className="closeBtn">
				x
			</button>
			<SwiperDefault effect={"cards"} modules={[EffectCards]} className="mySwiper">
				<SwiperSlide>
					<Story1 />
				</SwiperSlide>
				<SwiperSlide>
					<Story2 />
				</SwiperSlide>
				<SwiperSlide>
					<Story3 />
				</SwiperSlide>
			</SwiperDefault>
		</div>
	)
}
function Swiper({ onClose }) {
	return (
		<div className="swiperWrapper">
			<button onClick={onClose} className="closeBtn">
				x
			</button>
			<SwiperDefault pagination={true} /* effect={"cards"} modules={[EffectCards]} */ spaceBetween={30} modules={[Pagination]} className="mySwiper">
				<SwiperSlide>
					<Story1 />
				</SwiperSlide>
				<SwiperSlide>
					<Story2 />
				</SwiperSlide>
				<SwiperSlide>
					<Story3 />
				</SwiperSlide>
			</SwiperDefault>
		</div>
	)
}

function Stories({ onClose, stories }) {
	return (
		<div className="stories">
			<Suspense>
				<button onClick={onClose} className="closeBtn">
					x
				</button>
				<StoriesLazy
					preloadCount={3}
					loop
					height="100%"
					width="100%"
					keyboardNavigation
					defaultInterval={10000}
					stories={stories}
					onStoryEnd={(s, st) => console.log("story ended", s, st)}
					onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
					onStoryStart={(s, st) => console.log("story started", s, st)}
					onNext={() => console.log("next button pressed")}
					onPrevious={() => console.log("previous button pressed")}
					storyContainerStyles={{ borderRadius: 8, overflow: "hidden" }}
				/>
			</Suspense>
		</div>
	)
}

function App() {
	const [data, setData] = useState(null)
	const { isConnected, address } = useAccount({
		onConnect(data) {
			console.log(data)
			setData((prev) => Object.assign({ ...prev, ...data }))
		},
	})

	const { isFetching } = useBalance({
		address,
		onSuccess(data) {
			console.log(data)
			setData((prev) => Object.assign({ ...prev, ...data }))
		},
	})

	const stories = [
		{
			content: Story1,
		},
		{
			content: Story2,
		},
		{
			content: Story3,
		},
	]

	return (
		<DataContext.Provider value={data}>
			<div className="App">
				<ConnectButton />
				{isFetching && <p>Fetching data...</p>}
				{isConnected && <ConnectedBlock stories={stories} className={isFetching ? "process" : ""} />}
			</div>
		</DataContext.Provider>
	)
}

const exportAsImage = async () => {
	const node = document.getElementById("story1")
	const dataUrl = await toPng(node)
	console.log(dataUrl)
}
const dataUrlToBlob = async (dataUrl) => {
	const res = await fetch(dataUrl)
	const blob = await res.blob()
	return blob
}

const saveImage = async (ref) => {
	const canvas = await html2canvas(ref.current)
	const dataUrl = canvas.toDataURL("image/png")
	const blob = await dataUrlToBlob(dataUrl)
	console.log(blob)
	let link = document.createElement("a")
	link.href = dataUrl
	link.download = "image.png"
	link.click()

	if (navigator.share) {
		navigator.share({
			files: [blob],
			title: "info",
			text: "info text",
		})
	} else console.log("no share")
}

const Story1 = () => {
	const data = useContext(DataContext)
	const [url, setUrl] = useState("")
	const ref = useRef()
	const onButtonClick = useCallback(() => {
		if (ref.current === null) {
			return
		}

		saveImage(ref)
	}, [ref])

	return (
		<>
			<div className="story" ref={ref} id="story1">
				<img src={Element} className="element" />
				<h1>Your Address</h1>
				{navigator.share && <a href={url}>share</a>}
				<p>Your currently connected address:</p>
				<h3 className="address bold">{data?.address}</h3>
				<div className="bottom">
					<img src={Logo} />
					<div>SPOTIFY.COM/WRAPPED</div>
				</div>
			</div>
			<button
				type="button"
				className="share"
				onClick={() => {
					onButtonClick()
				}}
			>
				Share
			</button>{" "}
			{/* <TwitterShareButton children="Share" url={() => getCaptureURL(componentRef.current)} className="share" /> */}
			{/* <TelegramShareButton children="Share" url={url} className="share" /> */}
			{/* <button
				type="button"
				className="share"
				onClick={() => {
					exportAsImage(componentRef.current, "test")
				}}
			>
				Save
			</button> */}
		</>
	)
}

const Story2 = () => {
	const data = useContext(DataContext)
	const componentRef = useRef()

	return (
		<>
			<div className="story" ref={componentRef}>
				<img src={Element} className="element" />
				<h1>Your Balance</h1>
				<p>Your current balance:</p>
				<h3 className="bold">
					{data?.formatted} {data?.symbol}
				</h3>
				<div className="bottom">
					<img src={Logo} />
					<div>SPOTIFY.COM/WRAPPED</div>
				</div>
			</div>
			{/* <button
				type="button"
				className="share"

			>
				Share
			</button> */}
		</>
	)
}

const Story3 = () => {
	const data = useContext(DataContext)
	const componentRef = useRef()

	return (
		<>
			<div className="story" ref={componentRef}>
				<img src={Element} className="element" />
				<h1>Your Connector</h1>
				<p>Your current connector:</p>
				<h3 className="bold">{data?.connector?.name}</h3>
				<div className="bottom">
					<img src={Logo} />
					<div>SPOTIFY.COM/WRAPPED</div>
				</div>
			</div>
			{/* <button
				type="button"
				className="share"
		
			>
				Share
			</button> */}
		</>
	)
}

export default App
