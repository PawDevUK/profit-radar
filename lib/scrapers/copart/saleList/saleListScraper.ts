import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';
// Update the import path below to the correct relative path if needed
import { proxyConfig, ProxyConfig } from '@/lib/scrapers/proxy/proxy-config';
import { scrapeLot } from '@/lib/scrapers/copart/lot/lotScraper';

export default const saleListScraper = ({
	url:string
}){

}