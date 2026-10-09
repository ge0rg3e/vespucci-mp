import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Dependencies
import { Category, Entry, onClick, SubEntry } from './utils/types';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './utils/language';
import CategoriesMapping from './utils/map';
import { createAmplitudeEvent } from '@/utils/amplitude';

// Languages
const TranslationPack = createComponentLanguage('layout.sidebar', ComponentLanguages);

const Component = (props: ExpectedAny) => {
	const router = useRouter();
	const lang = getComponentLanguage(TranslationPack);

	// Variables
	const [navigationId, setNavigationId] = useState<ExpectedAny>(null);

	// Callbacks
	useEffect(() => {
		document.addEventListener(`navigation:switchMobileNavigation`, switchNavigationMobile);
		return () => {
			document.removeEventListener(`navigation:switchMobileNavigation`, switchNavigationMobile);
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		setNavigationId(null);
		let newClass: ExpectedAny = document.body.className;

		if (props.siteNavigationOpened || props.userNavigationOpened) {
			newClass += ` mobileNavigationOpened`;
		} else {
			newClass = newClass.replace(' mobileNavigationOpened', '');
		}
		document.body.className = newClass;
	}, [props.siteNavigationOpened, props.userNavigationOpened]);

	const switchNavigationMobile = () => {
		props.setSiteNavigationOpened((currentState: ExpectedAny) => !currentState);
	};

	const goHome = () => {
		router.push('/');
	};

	const getNavigationCategories = () => {
		const arr: ExpectedAny = [];

		// Main Categories: Players, Organisations, Economy, Server Info
		arr.push(CategoriesMapping.main);
		arr.push(CategoriesMapping.community);
		arr.push(CategoriesMapping.organisations);
		arr.push(CategoriesMapping.economy);
		arr.push(CategoriesMapping.serverInformation);

		return arr;
	};

	const selectNavigationCategory = (category: Category, entry: Entry) => {
		const newVal = `${category.id}-${entry.id}`;
		if (entry.entries && entry.entries.length > 0) {
			setNavigationId(newVal === navigationId ? null : newVal);
		} else if (entry.onClick && !entry.entries) {
			// When they click on a category with no entries.
			onItemSelected('category', entry, null);
		}
	};

	const onItemSelected = (type: string, data: ExpectedAny, parentData: ExpectedAny) => {
		const { onClick }: { onClick: onClick; label: string } = data;

		// @Action: Redirecting the user somewhere.
		if (onClick && onClick.action === 'redirect' && onClick.payload) {
			// Redirect them wherever needed.
			router.push(onClick.payload);

			// Create amplitude message
			const amplitudeEntryTitle = type === 'item' ? `${lang.get(parentData.id)} - ${lang.get(data.id)}` : lang.get(data.id);
			const messageAmplitude = `Selected "${amplitudeEntryTitle}" from Site Navigation`;
			createAmplitudeEvent(messageAmplitude);
		}
	};

	const isThisNavigationId = (category: Category, entry: Entry) => (navigationId === `${category.id}-${entry.id}` ? true : false);

	return (
		<React.Fragment>
			<div className="layout-sidebar-width spacing"></div>
			{props.siteNavigationOpened && <div className="layout-sidebar-shadow-mobile"></div>}
			<div className={`layout-sidebar layout-sidebar-width ${props.siteNavigationOpened ? 'mobile-opened' : 'mobile-closed'}`}>
				<div className="logo layout-sidebar-width" onClick={goHome}>
					<div className="text">VESPUCCI.MP</div>
					<div className="icon">
						<i className="elm fa-regular fa-tree-palm"></i>
					</div>
				</div>

				<div className="navigation">
					{getNavigationCategories().map((category: Category, ix: number) => (
						<div className="category" key={ix}>
							<div className="category-label">{lang.get(category.id)}</div>
							<div className="entries">
								{category.entries.map((entry: Entry, ixx: number) => (
									<div key={ixx} className={`entry ${isThisNavigationId(category, entry) ? 'selected' : 'not-selected'}`}>
										<div className="content" onClick={() => selectNavigationCategory(category, entry)}>
											<div className="details">
												<div className="icon">
													<i className={`elm ${entry.icon}`}></i>
												</div>
												<div className="label">{lang.get(entry.id)}</div>
											</div>
											{entry.entries && (
												<div className="arrow">
													{isThisNavigationId(category, entry) ? <i className="icon fa-solid fa-chevron-down"></i> : <i className="icon fa-solid fa-chevron-right"></i>}
												</div>
											)}
										</div>
										{entry.entries && (
											<div className={`sub-entries`}>
												{entry.entries.map((subEntry: SubEntry, ixxx: number) => (
													<div className="sub-entry" key={ixxx} onClick={() => onItemSelected('item', subEntry, entry)}>
														<div className="sub-content">
															<div className="sub-icon">
																<i className="elm fa-solid fa-genderless"></i>
															</div>
															<div className="sub-label">{lang.get(subEntry.id)}</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
