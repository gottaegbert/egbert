import * as React from 'react'
import Head from 'next/head'

import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'

const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(
        (m) => m.Collection
    )
)
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
    () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
    {
        ssr: false
    }
)
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    {
        ssr: false
    }
)

export const NotionPages = ({
    recordMap,
    rootPageId
}: {
    recordMap: ExtendedRecordMap
    rootPageId?: string
}) => {
    if (!recordMap) {
        return null
    }

    const title = getPageTitle(recordMap)
    console.log(title, recordMap)

    return (
        <>
            <Head>
                <meta name='description' content='Egbert Blog' />

                <title>{title}</title>
            </Head>

            <NotionRenderer
                components={{
                    Code,
                    Collection,
                    Equation,
                    Modal,
                    Pdf,
                }}
                showCollectionViewDropdown={false}
                recordMap={recordMap}
                fullPage={false}
                darkMode={true}
                rootPageId={rootPageId}
            />
        </>
    )
}

