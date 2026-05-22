import { MapPin, Car, Gavel, Fuel, KeySquare, CarFront, ListTodo, ArrowDownUp, Calendar1, SearchCheck } from 'lucide-react';
import { ExSquareIcon } from './exSquare';
export const sizeIcons = 26;
export const colorIcons = '#4b5563';
export const strokeIcons = 2;
import './style.css';

const BodyTypeIcon = () => {
	return (
		<svg
			data-gui='atds-icon-body-type-filter'
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill={`${colorIcons}`}
			className='checkboxIcon'>
			<path d='M16 13H8V15H16V13Z'></path>
			<path d='M21.79 10.1L20.94 8.41L19.98 4.68C19.82 3.71 18.99 3 18 3H5.98C5 3 4.17 3.7 4.03 4.59L3.06 8.42L2.21 10.11C2.07 10.39 2 10.69 2 11V19C2 20.1 2.9 21 4 21H6.01C7.11 21 8.01 20.1 8.01 19H16.01C16.01 20.1 16.91 21 18.01 21H20.01C21.11 21 22.01 20.1 22.01 19V11C22.01 10.69 21.94 10.38 21.8 10.1H21.79ZM19 13H20V19H18V17H6V19H4V13H5C6.1 13 7 12.1 7 11H4L4.89 9.21L5.98 5L18.03 5.09L19.03 9.01L20 11H17C17 12.1 17.9 13 19 13Z'></path>
		</svg>
	);
};

const Make = () => {
	return (
		<svg
			data-gui='atds-icon-make-icon'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			className='Icon-custom-class'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			fill={`${colorIcons}`}>
			<title>Make icon</title>
			<path
				xmlns='http://www.w3.org/2000/svg'
				d='M22 9V7H16.41C15.14 6.37 13.63 6 12 6C10.37 6 8.85 6.37 7.59 7H2V9H5.08C4.61 9.61 4.28 10.28 4.12 11H2V13H4.12C4.28 13.72 4.61 14.39 5.08 15H2V17H7.59C8.86 17.63 10.37 18 12 18C13.63 18 15.15 17.63 16.41 17H22V15H18.92C19.39 14.39 19.72 13.72 19.88 13H22V11H19.88C19.72 10.28 19.39 9.61 18.92 9H22ZM6 12C6 9.83 8.75 8 12 8C15.25 8 18 9.83 18 12C18 14.17 15.25 16 12 16C8.75 16 6 14.17 6 12Z'></path>
		</svg>
	);
};

const Engine = () => {
	return (
		<svg
			data-gui='atds-icon-engine-size-filter'
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			fill={`${colorIcons}`}
			viewBox='0 0 24 24'
			className='checkboxIcon'>
			<title>Engine size filter</title>
			<path d='M20 6H18V5C18 3.9 17.1 3 16 3H10C8.9 3 8 3.9 8 5V6H7C5.89 6 5 6.9 5 8V9H4V7H2V13H4V11H5V12C5 13.1 5.9 14 7 14H7.47L8.88 16.11C9.25 16.67 9.88 17 10.55 17H16.01C17.11 17 18.01 16.1 18.01 15V14H22.01V6H20.01H20ZM20 12H16V15H10.53L8.53 12H6.99V8H9.99V5H15.99V8H19.99V12H20Z'></path>
			<path d='M21 16L19 18H20V19H4V18H5L3 16L1 18H2V19V20V21H22V20V19V18H23L21 16Z'></path>
		</svg>
	);
};
const Gears = () => {
	return (
		<svg
			data-gui='atds-icon-transmission-filter'
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill={`${colorIcons}`}
			className='checkboxIcon'>
			<title>Transmission filter</title>
			<path d='M21 5C21 3.9 20.1 3 19 3C17.9 3 17 3.9 17 5C17 5.74 17.4 6.38 18 6.72V11H13V6.72C13.6 6.37 14 5.74 14 5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5C10 5.74 10.4 6.38 11 6.72V11H6V6.72C6.6 6.37 7 5.74 7 5C7 3.9 6.1 3 5 3C3.9 3 3 3.9 3 5C3 5.74 3.4 6.38 4 6.72V17.27C3.4 17.62 3 18.25 3 18.99C3 20.09 3.9 20.99 5 20.99C6.1 20.99 7 20.09 7 18.99C7 18.25 6.6 17.61 6 17.27V12.99H11V17.27C10.4 17.62 10 18.25 10 18.99C10 20.09 10.9 20.99 12 20.99C13.1 20.99 14 20.09 14 18.99C14 18.25 13.6 17.61 13 17.27V12.99H18C19.1 12.99 20 12.09 20 10.99V6.72C20.6 6.37 21 5.74 21 5Z'></path>
		</svg>
	);
};
const VehicleType = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={`${sizeIcons}`}
			height={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill='none'
			stroke={`${colorIcons}`}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' />
			<circle cx='7' cy='17' r='2' />
			<path d='M9 17h6' />
			<circle cx='17' cy='17' r='2' />
			<g transform='translate(-2,-3)'>
				<path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
				<path d='M12 16h.01' />
			</g>
		</svg>
	);
};

const Mileage = () => {
	return (
		<svg
			data-gui='atds-icon-mileage-filter'
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill={`${colorIcons}`}
			className='checkboxIcon'>
			<title>Mileage filter</title>
			<path d='M14.93 7.36988L13.07 6.62988L11.07 11.6299C11.02 11.7499 11 11.8699 11 11.9999C11 12.5499 11.45 12.9999 12 12.9999C12.42 12.9999 12.78 12.7399 12.93 12.3699L14.93 7.36988Z'></path>
			<path d='M12 2C6.49 2 2 6.49 2 12C2 15.03 3.35 17.87 5.71 19.78L6.04 19.38L8.21 17.21L6.8 15.8L5.69 16.91C4.81 15.78 4.27 14.44 4.09 13.01H6.01V11.01H4.08C4.26 9.55 4.84 8.22 5.7 7.11L6.8 8.21L8.21 6.8L7.11 5.7C8.22 4.84 9.55 4.26 11.01 4.08V6.01H13.01V4.08C14.47 4.26 15.8 4.84 16.91 5.7L15.81 6.8L17.22 8.21L18.32 7.11C19.18 8.22 19.76 9.55 19.94 11.01H18.01V13.01H19.93C19.75 14.44 19.21 15.79 18.33 16.91L17.22 15.8L15.81 17.21L17.98 19.38L18.31 19.78C20.67 17.87 22.02 15.04 22.02 12C22.02 6.49 17.53 2 12.02 2H12Z'></path>
		</svg>
	);
};

const CarCondition = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill='none'
			stroke={`${colorIcons}`}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' />
			<circle cx='7' cy='17' r='2' />
			<path d='M9 17h6' />
			<circle cx='17' cy='17' r='2' />
			<path d='m7 10 2.5 2.5L15 8' stroke={`${colorIcons}`} strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	);
};

const DriveType = () => {
	return (
		<svg
			data-gui='atds-icon-drive-type-filter'
			xmlns='http://www.w3.org/2000/svg'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}
			viewBox='0 0 24 24'
			fill={`${colorIcons}`}
			className='atds-icon-svg'>
			<title>Drive type filter</title>
			<path d='M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z'></path>
			<path d='M12 5.5C8.42 5.5 5.5 8.42 5.5 12C5.5 15.58 8.42 18.5 12 18.5C15.58 18.5 18.5 15.58 18.5 12C18.5 8.42 15.58 5.5 12 5.5ZM7.5 12C7.5 10.87 7.93 9.84 8.63 9.05L10.18 11.19C10.12 11.32 10.08 11.45 10.05 11.58L7.54 12.39C7.53 12.26 7.5 12.13 7.5 12ZM13.95 11.58C13.92 11.44 13.88 11.31 13.82 11.19L15.37 9.05C16.06 9.84 16.5 10.87 16.5 12C16.5 12.13 16.47 12.26 16.46 12.39L13.95 11.58ZM13.76 7.86L12.2 10.02C12.13 10.02 12.07 10 12 10C11.93 10 11.87 10.01 11.8 10.02L10.24 7.86C10.78 7.63 11.38 7.5 12.01 7.5C12.64 7.5 13.23 7.63 13.78 7.86H13.76ZM8.15 14.29L10.67 13.48C10.77 13.57 10.88 13.65 11 13.72V16.38C9.79 16.1 8.77 15.33 8.15 14.3V14.29ZM13 16.37V13.71C13.12 13.64 13.23 13.56 13.33 13.47L15.85 14.28C15.23 15.32 14.21 16.09 13 16.36V16.37Z'></path>
		</svg>
	);
};

const V8Icon = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke={`${colorIcons}`}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			height={`${sizeIcons}`}
			width={`${sizeIcons}`}>
			<path d='M4 8l8 12 8-12' />
			<circle cx='12' cy='3' r='2' />
			<circle cx='12' cy='8.5' r='3' />
		</svg>
	);
};

export const engineTypeIcon = <Engine />;
export const transmissionIcon = <Gears />;
export const driveTrainIcon = <DriveType />;
export const cylindersIcon = <V8Icon />;
export const vehicleConditionIcon = <CarCondition />;
export const vehicleTypeIcon = <VehicleType />;
export const sortIcon = <ArrowDownUp strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const makeIcon = <Make />;
export const modelIcon = <KeySquare strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const titleTypeIcon = <ListTodo strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const fuelTypeIcon = <Fuel strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const auctionNameIcon = <Gavel strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const locationIcon = <MapPin strokeWidth={strokeIcons} className='Icon-custom-class' />;
export const bodyStyleIcon = <Car strokeWidth={strokeIcons} className='Icon-custom-class' />;

export const iconsArray = [
	{ name: 'Body Type', icon: <BodyTypeIcon /> },
	{ name: 'Engine Type', icon: <Engine /> },
	{ name: 'Odometer', icon: <Mileage /> },
	{ name: 'Transmission', icon: <Gears /> },
	{ name: 'DriveTrain', icon: <DriveType /> },
	{ name: 'Cylinders', icon: <V8Icon /> },
	{ name: 'Vehicle Condition', icon: <CarCondition /> },
	{ name: 'Vehicle Type', icon: <VehicleType /> },
	{ name: 'Odometer Description', icon: <SearchCheck className='Icon-custom-class' /> },
	{ name: 'Trim', icon: <ExSquareIcon className='Icon-custom-class' /> },
	{ name: 'Year', icon: <Calendar1 className='Icon-custom-class' /> },
	{ name: 'Sort', icon: <ArrowDownUp strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'Make', icon: <Make /> },
	{ name: 'Model', icon: <KeySquare strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'TitleType', icon: <ListTodo strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'Fuel', icon: <Fuel strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'Auction Name', icon: <Gavel strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'Location', icon: <MapPin strokeWidth={strokeIcons} className='Icon-custom-class' /> },
	{ name: 'Body Style', icon: <Car strokeWidth={strokeIcons} className='Icon-custom-class' /> },
];
