// Function to run Otomoto verification for this car
// const runOtomotoVerification = async () => {
// 	if (!car) return;
// 	setOtomotoLoading(true);
// 	try {
// 		// Send car details to API for verification
// 		const response = await fetch('/api/otomoto-listing-check', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({
// 				make: car.make,
// 				model: car.model,
// 				lotNumber: car.lotNumber,
// 				year: car.year,
// 				odometer: car.odometer,
// 			}),
// 		});

// 		if (response.ok) {
// 			const data = await response.json();
// 			if (data.result) {
// 				setOtomotoResult({
// 					lotNumber: car.lotNumber,
// 					title: car.title,
// 					make: car.make,
// 					model: car.model,
// 					searchQuery: `${car.make} ${car.model}`.toLowerCase(),
// 					url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
// 					found: data.result.listed_otomoto,
// 					count: data.result.listing_count,
// 				});
// 			}
// 		} else {
// 			console.error('API error:', await response.text());
// 		}
// 	} catch (error) {
// 		console.error('Error running Otomoto verification:', error);
// 	} finally {
// 		setOtomotoLoading(false);
// 	}
// };

// // // Load Otomoto listing check result
// useEffect(() => {
// 	if (car && !otomotoCheckRef.current) {
// 		otomotoCheckRef.current = true;

// 		const loadOtomotoListingCheck = async () => {
// 			setOtomotoLoading(true);
// 			try {
// 				const response = await fetch('/api/otomoto-listing-check?action=load');
// 				if (response.ok) {
// 					const data = await response.json();
// 					const carCheck = data.results?.find((r: OtomotoCheckRecord) => r.lotNumber === car.lotNumber);
// 					if (carCheck) {
// 						const searchQuery = `${car.make} ${car.model}`.toLowerCase();
// 						setOtomotoResult({
// 							lotNumber: car.lotNumber,
// 							title: car.title,
// 							make: car.make,
// 							model: car.model,
// 							searchQuery: searchQuery,
// 							url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
// 							found: carCheck.listed_otomoto,
// 							count: carCheck.listing_count,
// 						});
// 					} else {
// 						// If car not in check results, run verification automatically
// 						await runOtomotoVerification();
// 					}
// 				}
// 			} catch (error) {
// 				console.error('Error loading Otomoto listing check:', error);
// 			} finally {
// 				setOtomotoLoading(false);
// 			}
// 		};

// 		loadOtomotoListingCheck();
// 	}
// }, [car]);
