import styles from './DeveloperOverlay.module.css'
/**
 * 开发工具组件。用于提供控件方便即时修改应用状态以用于各种测试。
 */
export const DeveloperOverlay: React.FC = () => {
    return (
        <div id={styles['developer-overlay']}>
            <div style={{height: '40px', width: '100%', backgroundColor: 'rgba(127, 127, 127, .5)', display: 'flex', gap: '2px', pointerEvents: 'all'}}>
                <button>
                    Hello, World!
                </button>
            </div>
        </div>
        
    )
}