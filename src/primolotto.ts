import axios, {AxiosResponse} from 'axios';
import tough = require('tough-cookie');
import axiosCookieJarSupport from 'axios-cookiejar-support';
import {Grid} from './utils/grid';
import * as cheerio from 'cheerio';
import * as querystring from 'querystring';
import {CookieExtractor} from './utils/cookie-extractor';
import {GridInfo} from './interface/gridInfo';

export class Primolotto {
    private uri = {
        connect: '/login',
        playUri: '/grid/confirm',
        gridUri: '/grid',
        scratchStart: '/scratch/play/1',
        scratchEnd: '/scratch/end/1',
    }

    private axiosInstance = axios.create({
        baseURL: 'https://www.primolotto.com/',
        withCredentials: true,
    });

    private constructor(
        private email: string,
        private password: string
    ) {
        axiosCookieJarSupport(this.axiosInstance);
        this.axiosInstance.defaults.jar = new tough.CookieJar();
    }

    public static async init(email: string, password: string): Promise<Primolotto>
    {
        const self = new Primolotto(email, password);
        const token = await self.tokenConnect();
        return await self.connect(token);
    }

    public async playGrid(): Promise<boolean>
    {
        const data = await this.fetchGridToken();
        if(data.grid_number === undefined) {
            return false;
        }
        return this.postGrid(data);
    }

    private async fetchGridToken(): Promise<GridInfo>
    {
        return await this.axiosInstance.get(this.uri.gridUri)
            .then(response => {
                const $ = cheerio.load(response.data);
                return {
                    token: $('input[name="_token"]').val(),
                    grid_number: $('input[name="grid_number"]').val(),
                };
            });
    }

    private async postGrid(grid: GridInfo): Promise<boolean>
    {
        const postData = querystring.stringify({
            'grid_number': grid.grid_number,
            '_token': grid.token,
            'grid': Grid.generate,
        });
        const axiosConfig = {
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded',
            }};
        return await this.axiosInstance.post(this.uri.playUri, postData, axiosConfig)
            .then(response => {
                return response.status === 200
            });
    }

    private async tokenConnect(): Promise<string>
    {
        return await this.axiosInstance.get(this.uri.connect)
            .then(response => {

                const $ = cheerio.load(response.data);

                return $('input[name="_token"]').val();
            });
    }

    public async scratch(): Promise<boolean>
    {
        const canContinue = this.scratchStart();

        if(!canContinue) {
            return false;
        }

        const response = await this.axiosInstance.get(this.uri.scratchEnd);
        return response.status === 200;
    }

    private async scratchStart(): Promise<boolean>
    {
        const response = await this.axiosInstance.get(this.uri.scratchStart);

        const $ = cheerio.load(response.data);

        const scratchNumber = $('.scratch-progress').text().trim();
        const found = scratchNumber.match(/5 \/ 5/);

        return found === null;
    }

    private async connect(token: string): Promise<Primolotto>
    {
        const postData = querystring.stringify({
            _token: token,
            email: this.email,
            password: this.password,
            remember: 'on',
        });
        const axiosConfig = {
            headers: {
            'Content-Length': postData.length,
            'Content-Type': 'application/x-www-form-urlencoded',
        }};
        await this.axiosInstance.post(this.uri.connect, postData, axiosConfig)
            .then(response => {
                const cookies = response.headers['set-cookie'];
                if(cookies !== undefined || !CookieExtractor.isContainAllCookies(cookies)) {
                    this.axiosInstance.defaults.headers['Cookie'] = CookieExtractor.getCookiesString(cookies);
                }
                return response.status === 200
            });

        return this;
    }
}
