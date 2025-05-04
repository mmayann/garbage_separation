// __tests__/RegionForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegionForm from '../RegionForm';
import { useTrash } from '../../contexts/trash-context';
import { useLanguage } from '../../contexts/language-context';
import axios from 'axios';
import { describe, it, expect, vi, type Mocked } from 'vitest'; // vi と Mocked を import

// useRouter のモック
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

// useTrash のモック
const mockSetRegion = vi.fn();
vi.mock('../components/contexts/trash-context', () => ({
    useTrash: () => ({
        setRegion: mockSetRegion,
    }),
}));

// useLanguage のモック
const mockT = (key: string) => {
    switch (key) {
        case 'nav.region.settings':
            return '地域設定';
        case 'main.postalCode':
            return '郵便番号';
        case 'main.postalCodeExample':
            return '例：123-4567';
        case 'main.go':
            return '検索';
        case 'main.selectAnArea':
            return '地域を選択してください';
        case 'main.areaSelect':
            return '地域を選択';
        default:
            return key;
    }
};
vi.mock('../components/contexts/language-context', () => ({
    useLanguage: () => ({
        t: mockT,
    }),
}));

// axios のモック
vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

// グローバルな fetch のモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('RegionForm コンポーネント', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // jest.clearAllMocks() を vi.clearAllMocks() に変更
        localStorage.clear();
        mockFetch.mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: [{ id: 1, name: 'Test Data' }] }),
        } as Response);
    });

    it('初期表示で郵便番号入力フォームと検索ボタンが表示される', () => {
        render(<RegionForm />);
        expect(screen.getByLabelText('郵便番号')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('例：123-4567')).toBeInTheDocument();
        expect(screen.getByText('検索')).toBeInTheDocument();
        expect(screen.queryByLabelText('地域を選択してください')).toBeNull();
        expect(screen.queryByRole('combobox')).toBeNull();
        expect(screen.queryByText('OK')).toBeNull();
    });

    it('無効な郵便番号で検索しても地域候補が表示されない', async () => {
        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: 'invalid' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/areas?zipcode=invalid');
        });

        // エラーメッセージが表示されるかどうかは API のレスポンスに依存するため、ここでは省略
        expect(screen.queryByLabelText('地域を選択してください')).toBeNull();
        expect(screen.queryByRole('combobox')).toBeNull();
        expect(screen.queryByText('OK')).toBeNull();
    });

    it('有効な郵便番号で検索すると地域候補が表示され、選択できる', async () => {
        const mockAreas = [
            { area: '東京都', area_en: 'tokyo', address1: '東京都', address2: '', connect_address: '東京都', zipcode: '100-0001' },
            { area: '大阪府', area_en: 'osaka', address1: '大阪府', address2: '', connect_address: '大阪府', zipcode: '530-0001' },
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ areas: mockAreas }),
        } as Response);

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/areas?zipcode=123-4567');
        });

        expect(screen.getByLabelText('地域を選択してください')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('地域を選択')).toBeInTheDocument();
        expect(screen.getByText('tokyo')).toBeInTheDocument();
        expect(screen.getByText('osaka')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();

        // 地域を選択
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(screen.getByText('tokyo'));
        expect(screen.getByText('tokyo')).toBeInTheDocument();
    });

    it('地域を選択してOKボタンを押すと、APIが呼ばれ、localStorageが更新され、画面遷移する', async () => {
        const mockAreas = [
            { area: '東京都', area_en: 'tokyo', address1: '東京都', address2: '', connect_address: '東京都', zipcode: '100-0001' },
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ areas: mockAreas }),
        } as Response);

        const mockAreaData = { area: '東京都', area_en: 'tokyo' };
        mockedAxios.get.mockResolvedValueOnce({ data: { area: '東京都' } });

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/areas?zipcode=123-4567');
        });

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(screen.getByText('tokyo'));

        const okButton = screen.getByText('OK');
        await userEvent.click(okButton);

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/area/tokyo');
            expect(mockSetRegion).toHaveBeenCalledWith({ area: '東京都', area_en: 'tokyo' });
            expect(global.fetch).toHaveBeenCalledWith('/api?area=%E6%9D%B1%E4%BA%AC%E9%83%BD', { cache: 'no-store' });
            expect(localStorage.setItem).toHaveBeenCalledWith('calendarData', JSON.stringify([{ id: 1, name: 'Test Data' }]));
            expect(mockRouterPush).toHaveBeenCalledWith('/calendar?area=%E6%9D%B1%E4%BA%AC%E9%83%BD');
        });
    });

    it('地域が選択されていない状態でOKボタンを押すとエラーメッセージが表示される', async () => {
        const mockAreas = [
            { area: '東京都', area_en: 'tokyo', address1: '東京都', address2: '', connect_address: '東京都', zipcode: '100-0001' },
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ areas: mockAreas }),
        } as Response);

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/areas?zipcode=123-4567');
        });

        const okButton = screen.getByText('OK');
        await userEvent.click(okButton);

        await waitFor(() => {
            expect(screen.getByText('Please select an area.')).toBeInTheDocument();
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('地域情報の取得APIが失敗した場合、エラーメッセージが表示される', async () => {
        const mockAreas = [
            { area: '東京都', area_en: 'tokyo', address1: '東京都', address2: '', connect_address: '東京都', zipcode: '100-0001' },
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ areas: mockAreas }),
        } as Response);

        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to get area information.'));

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/areas?zipcode=123-4567');
        });

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(screen.getByText('tokyo'));

        const okButton = screen.getByText('OK');
        await userEvent.click(okButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to get area information.')).toBeInTheDocument();
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('初期表示でローディング中でない', () => {
        render(<RegionForm />);
        expect(screen.queryByText('読み込み中...')).toBeNull();
    });

    it('検索ボタンクリック時にローディング中と表示され、API 処理後に消える', async () => {
        const mockAreas = [
            { area: '東京都', area_en: 'tokyo', address1: '東京都', address2: '', connect_address: '東京都', zipcode: '100-0001' },
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ areas: mockAreas }),
        } as Response);

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        expect(screen.getByText('読み込み中...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('読み込み中...')).toBeNull();
        });
    });

    it('郵便番号検索APIが失敗した場合、エラーメッセージが表示される', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Failed to fetch area candidates'));

        render(<RegionForm />);
        const postalCodeInput = screen.getByLabelText('郵便番号') as HTMLInputElement;
        const searchButton = screen.getByText('検索');

        fireEvent.change(postalCodeInput, { target: { value: '123-4567' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch area candidates')).toBeInTheDocument();
            expect(screen.queryByLabelText('地域を選択してください')).toBeNull();
            expect(screen.queryByRole('combobox')).toBeNull();
            expect(screen.queryByText('OK')).toBeNull();
        });
    });
});