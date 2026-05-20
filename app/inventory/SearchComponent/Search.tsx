import CheckBoxList from './checkBoxList';
import {
	sortIcon,
	makeIcon,
	modelIcon,
	titleTypeIcon,
	bodyStyleIcon,
	vehicleConditionIcon,
	vehicleTypeIcon,
	engineTypeIcon,
	transmissionIcon,
	fuelTypeIcon,
	driveTrainIcon,
	cylindersIcon,
	auctionNameIcon,
	locationIcon,
} from '@/app/components/common/icons';

import { useAllCars } from '@/lib/state/allCars.state';
import './style.css';
import { useSetOpenSearch } from '@/lib/state/openSearch.state';
import { useResetSearchFilters } from '@/lib/state/searchFilters.state';
import SearchChipButton from '@/app/components/common/buttons/logButton';
import {
	sort,
	titleType,
	conditionType,
	vehicleType,
	engineType,
	transmissionType,
	fuelType,
	driveTrain,
	cylinderType,
	auctionName,
	location,
	bodyType,
} from '@/app/inventory/options';
import { useFilterResultsStore } from '@/lib/state/searchFilters.state';
import { selectSearchFilterByKey } from '@/lib/state/selectors/searchFilters.selectors';
import { X } from 'lucide-react';

const CloseButton = ({ toggleFilters }: { toggleFilters: () => void }) => {
	return (
		<button className='w-8 h-8' onClick={toggleFilters}>
			{<X id='closeButton' className='ml-2 checkboxIcon' />}
		</button>
	);
};

export default function SideSearch() {
	const toggleOpenSearch = useSetOpenSearch();
	function getStateModels(make: string) {
		const selectedModels: string[] = [];
		cars.forEach((car) => {
			if (car.make === make && car.model) {
				selectedModels.push(car.model);
			}
		});
		return [...new Set(selectedModels.map((model) => model))].sort();
	}
	function getStateMakes() {
		return [...new Set(cars.map((car) => (car.make ? car.make : '')))].sort();
	}
	const toggleFilters = () => {
		toggleOpenSearch();
	};
	const cars = useAllCars();
	const sortFilter = useFilterResultsStore(selectSearchFilterByKey('sort'));
	const makeFilter = useFilterResultsStore(selectSearchFilterByKey('make'));
	const selectedModelsFilter = useFilterResultsStore(selectSearchFilterByKey('selectedModels'));
	const vehicleTitleTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleTitleType'));
	const vehicleConditionTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleConditionType'));
	const vehicleTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleType'));
	const engineTypeFilter = useFilterResultsStore(selectSearchFilterByKey('engineType'));
	const transmissionFilter = useFilterResultsStore(selectSearchFilterByKey('transmission'));
	const fuelTypeFilter = useFilterResultsStore(selectSearchFilterByKey('fuelType'));
	const driveTrainFilter = useFilterResultsStore(selectSearchFilterByKey('driveTrain'));
	const cylindersFilter = useFilterResultsStore(selectSearchFilterByKey('cylinders'));
	const auctionNameFilter = useFilterResultsStore(selectSearchFilterByKey('auctionName'));
	const locationFilter = useFilterResultsStore(selectSearchFilterByKey('location'));
	const bodyStyleFilter = useFilterResultsStore(selectSearchFilterByKey('bodyStyle'));
	const models = getStateModels(makeFilter);
	const makes = getStateMakes();
	const toggleSearch = useSetOpenSearch();
	const resetFilters = useResetSearchFilters();
	return (
		<aside className='flex flex-col md:w-150 mx-auto h-[100dvh]  md:h-[80vh]  bg-white shadow-lg md:shadow-none z-15 md:rounded-md'>
			<div className='px-10 py-6 flex items-center justify-between z-15'>
				<h2 className='text-[22px] font-bold text-(--header-text)'>Filter and sort</h2>
				<div className='flex items-center gap-2'>
					<CloseButton toggleFilters={toggleFilters} />
				</div>
			</div>
			<div className='overflow-y-auto'>
				<div className='flex flex-col '>
					<CheckBoxList title='Sort' options={sort} selected={sortFilter} icon={sortIcon} />
					<CheckBoxList title='Make' options={makes} selected={makeFilter} scrollable searchable icon={makeIcon} />
					{models.length > 0 ? <CheckBoxList multiSelect title='Model' options={models} selected={selectedModelsFilter} scrollable searchable icon={modelIcon} /> : ''}
					<CheckBoxList multiSelect title='Vehicle title type' options={titleType} selected={vehicleTitleTypeFilter} icon={titleTypeIcon} />
					<CheckBoxList multiSelect title='Body style' options={bodyType} selected={bodyStyleFilter} icon={bodyStyleIcon} />
					<CheckBoxList title='Vehicle condition type' options={conditionType} selected={vehicleConditionTypeFilter} icon={vehicleConditionIcon} />
					<CheckBoxList multiSelect title='Vehicle type' options={vehicleType} selected={vehicleTypeFilter} scrollable searchable icon={vehicleTypeIcon} />
					<CheckBoxList multiSelect title='Engine type' options={engineType} selected={engineTypeFilter} icon={engineTypeIcon} />
					<CheckBoxList multiSelect title='Transmission' options={transmissionType} selected={transmissionFilter} icon={transmissionIcon} />
					<CheckBoxList multiSelect title='Fuel type' options={fuelType} selected={fuelTypeFilter} icon={fuelTypeIcon} />
					<CheckBoxList multiSelect title='Drive train' options={driveTrain} selected={driveTrainFilter} icon={driveTrainIcon} />
					<CheckBoxList multiSelect title='Cylinders' options={cylinderType} selected={cylindersFilter} icon={cylindersIcon} />
					<CheckBoxList multiSelect title='Auction name' options={auctionName} selected={auctionNameFilter} icon={auctionNameIcon} />
					<CheckBoxList multiSelect title='Location' options={location} selected={locationFilter} scrollable icon={locationIcon} />
				</div>
			</div>
			<div className='m-6 w-[90%] mx-auto flex space-x-4  md:h-auto'>
				<div className='flex-auto'>
					<SearchChipButton onclick={resetFilters} item={{ href: '#', label: 'Clear All' }}></SearchChipButton>
				</div>
				<div className='flex-auto'>
					<SearchChipButton onclick={toggleSearch} item={{ href: '', label: 'Search' }}></SearchChipButton>
				</div>
			</div>
		</aside>
	);
}
