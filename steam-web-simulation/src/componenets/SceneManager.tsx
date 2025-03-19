import React, { useState, useEffect, useRef } from 'react'; 
import './SceneManager.css';
// @ts-ignore
import { SceneManager } from 'gzweb'; 

const SceneManagerComponent: React.FC = () => {
    // Set variables 
    const [wsUrl, setWsUrl] = useState('placeholder'); 
    const [sceneManager, setSceneManager] = useState<any>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false); 
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle connection status updates
    useEffect(() => {
        if (sceneManager) {
            const subscription = sceneManager.getConnectionStatusAsObservable().subscribe(
                (status: boolean) => {
                    setConnectionStatus(status); 
                }
            );
            return () => {
                subscription.unsubscribe(); 
            };
        }
    }, [sceneManager]);

    // Connect to simulation 
    const connect = () => {
        const manager = new SceneManager({
            websocketUrl: wsUrl,
            websocketKey: '',
            elementId: 'container',
        }); 
        setSceneManager(manager); 
    };

    const resize = () => {
        if (sceneManager) {
            sceneManager.resize(); 
        }
    };

    const snapshot = () => {
        if (sceneManager) {
            sceneManager.snapshot(); 
        }
    };

    const resetView = () => {
        if (sceneManager) {
            sceneManager.resetView(); 
        }
    };

    useEffect (() => {
        window.addEventListener('resize', resize); 
        return () => {
            window.removeEventListener('resize', resize); 
        };
    }, [sceneManager]);

    return (
        <>
            <section>
                <div className="form-field"> 
                    <label htmlFor="wsUrl">Websocket URL </label>
                    <input 
                        id="wsUrl"
                        type="text"
                        value={wsUrl}
                        onChange={(e) => setWsUrl(e.target.value)}
                        placeholder="websocket URL"
                        />
                </div>
                {(!sceneManager || !connectionStatus) && (
                    <button className="primary-button" onClick={connect}>Connect</button>
                )}

                {sceneManager && connectionStatus && (
                    <React.Fragment>
                        <button className="primary-button" onClick={snapshot}>Snapshot</button>
                        <button className="primary-button" onClick={resetView}>Reset View</button>
                    </React.Fragment>
                )}
            </section>
            <div id="container" ref={containerRef}></div>
        </>
    );

};

export default SceneManagerComponent;