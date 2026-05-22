import React, { useState } from 'react';
import type { LotWithProfitStatusType } from '@/lib/types/lotDetails-type';
import { ProfitStatusDetailsType } from '@/lib/types/profitStatus-type';
import { Spinner } from '@/app/components/common/spinner';

const Row = ({ label, value }: { label: string; value: string | boolean | number | undefined }) => (
	<div>
		<p className='text-xs text-gray-600'>{label}</p>
		<p className='text-sm font-medium text-gray-900'>{value ?? '-'}</p>
	</div>
);

export default function ProfitSection(lotData: LotWithProfitStatusType) {
	const [isGeneratingReport, setIsGeneratingReport] = useState(false);
	const [reportMessage, setReportMessage] = useState<string | null>(null);
	const [lotWithReport, setLotWithReport] = useState<LotWithProfitStatusType>();
	const [profitStatus, setProfitStatus] = useState<ProfitStatusDetailsType | undefined>(lotData.profitStatus);
	const handleGenerateReportAndSave = async () => {
		setIsGeneratingReport(true);
		try {
			const report = await fetch(`/api/copart/getRaportAndSave`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(lotData),
			});
			const response = await report.json();

			if (report.ok) {
				setLotWithReport(response.report.lotWithProfitStatus);
				setReportMessage(response.message);
				setProfitStatus(response.report.lotWithProfitStatus.profitStatus);
			}
			// Add your report generation logic here
		} catch (error) {
			setReportMessage('Error generating report');
		} finally {
			setIsGeneratingReport(false);
		}
	};

	if (isGeneratingReport) {
		return <div>{Spinner('Generating report!')}</div>;
	}

	return (
		<div className='col-span-2 rounded-md bg-white p-0.5'>
			{profitStatus && !profitStatus.bestChoice && (
				<div className='flex justify-end p-3'>
					{!isGeneratingReport && reportMessage ? <p className='mt-2 text-sm text-gray-700'>{reportMessage}</p> : null}
					{isGeneratingReport ? <p className='mt-2 text-sm text-gray-700'>Report generation is in process...</p> : null}
					<button
						type='button'
						onClick={handleGenerateReportAndSave}
						disabled={isGeneratingReport}
						className='inline-flex items-center justify-center rounded-md bg-(--mongo-green) ml-10 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'>
						{isGeneratingReport ? 'Generating report...' : 'Generate Profit Report'}
					</button>
				</div>
			)}
			{profitStatus && profitStatus.bestChoice ? (
				<>
					<div className='col-span-2 mt-2 border-t border-gray-100 pt-3'>
						<div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
							<Row label='Estimated Repair Level' value={profitStatus.estimatedRepairLevel} />
							<Row label='Damage' value={profitStatus.damage} />
							<Row label='Non Profit' value={profitStatus.nonProfit} />
							<Row label='Best Choice Country' value={profitStatus.bestChoice?.country} />
							<Row label='Best Choice Why' value={profitStatus.bestChoice?.whyBest} />
						</div>
					</div>

					{profitStatus.topCountries.map((country, idx) => (
						<div key={`${country.country}-${idx}`} className='col-span-2 mt-2 rounded-md border border-gray-100 p-3'>
							<h4 className='mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700'>
								#{country.rank} {country.country}
							</h4>
							<div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
								<Row label='Distance Auction To Port' value={country.distanceAuctionToPort} />
								<Row label='Inland USA Transport' value={country.estimateInLandUsaTransport} />
								<Row label='Inland USA Transport Cost' value={country.estimateInLandUsaTransportCost} />
								<Row label='Port Of Origin' value={country.portOfOrigin} />
								<Row label='Port Of Destination' value={country.portOfDestination} />
								<Row label='Days Of Sail' value={country.daysOfSail} />
								<Row label='Sea Transport Cost' value={country.estimateSeaTransportCost} />
								<Row label='Purchase Cost USD' value={country.estimatedPurchaseCostUsd} />
								<Row label='Repair Cost USD' value={country.estimatedRepairCostUsd} />
								<Row label='Shipping And Import USD' value={country.estimatedShippingAndImportUsd} />
								<Row label='Total Cost USD' value={country.estimatedTotalCostUsd} />
								<Row label='Resale Value USD' value={country.estimatedResaleValueUsd} />
								<Row label='Net Profit USD' value={country.estimatedNetProfitUsd} />
								<Row label='ROI Percent' value={country.estimatedRoiPercent} />
								<Row label='Time To Sell Days' value={(country as { timeToSellDays?: number }).timeToSellDays} />
								<Row label='Confidence' value={country.confidence} />
								<Row label='Reasoning' value={country.reasoning} />
							</div>
							<div className='mt-2 text-sm text-gray-700'>
								Source:{' '}
								{(country as { resaleValueSource?: string }).resaleValueSource ? (
									<a
										href={(country as { resaleValueSource?: string }).resaleValueSource}
										target='_blank'
										rel='noreferrer'
										className='text-blue-600 hover:text-blue-800'>
										{(country as { resaleValueSource?: string }).resaleValueSource}
									</a>
								) : (
									'—'
								)}
							</div>
						</div>
					))}
				</>
			) : (
				''
			)}
		</div>
	);
}
