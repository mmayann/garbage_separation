// api/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');

  const url = `<span class="math-inline">\{process\.env\.CKAN\_BASE\_URL\}SELECT "日付", "</span>{area}" FROM "${process.env.CKAN_DATASET_ID}" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;
  const encoded = encodeURI(url);

  try {
    const response = await fetch(encoded, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`外部 API エラー: ${response.status} - ${response.statusText}`);
      return NextResponse.json({ success: false, error: `データの取得に失敗しました (${response.status})` }, { status: response.status });
    }

    const externalApiResult = await response.json();

    if (externalApiResult && externalApiResult.success && externalApiResult.result && externalApiResult.result.records) {
      const formattedData = externalApiResult.result.records.map((record: { [x: string]: any; }) => {
        const date = record["日付"];
        const value = record[`${area}`];
        return { [date]: value };
      });
      return NextResponse.json({ data: formattedData, success: true });
    } else {
      console.error("外部 API から期待するデータ構造ではありません:", externalApiResult);
      return NextResponse.json({ success: false, error: "データの取得に失敗しました" });
    }

  } catch (error: any) {
    console.error("API fetch error:", error.message);
    return NextResponse.json({ success: false, error: `API エラーが発生しました: ${error.message}` }, { status: 500 });
  }
}